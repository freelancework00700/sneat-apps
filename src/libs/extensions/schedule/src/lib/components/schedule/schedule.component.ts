import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	hideVirtualSlide,
	showVirtualSlide,
	virtualSliderAnimations,
	VirtualSliderAnimationStates,
} from '@sneat/components';
import { dateToIso, getWeekdayDate, localDateToIso } from '@sneat/core';
import { HappeningType, IHappeningDto, IRecurringWithUiState, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IMemberContext, IRecurringContext, ITeamContext } from '@sneat/team/models';
import { Subject } from 'rxjs';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ISlotItem, NewHappeningParams } from '../../view-models';
import { Weekday } from '../schedule-week/schedule-week.component';
import { animationState, ScheduleTab, SHIFT_1_DAY, SHIFT_1_WEEK } from './schedule-core';
import { Parity, SwipeableDay, SwipeableWeek } from './swipeable-ui';

@Component({
	selector: 'sneat-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss'],
	animations: virtualSliderAnimations,
})
export class ScheduleComponent implements AfterViewInit, OnChanges, OnDestroy {

	private readonly destroyed = new Subject<void>();
	// prevWeekdays: SlotsGroup[];
	public readonly teamDaysProvider: TeamDaysProvider;
	@Input() team?: ITeamContext;
	@Input() member?: IMemberContext;
	@Input() public tab: ScheduleTab = 'day';
	@Input() public date = '';
	@Output() readonly tabChanged = new EventEmitter<ScheduleTab>();
	@Output() readonly dateChanged = new EventEmitter<string>();
	public showRecurrings = true;
	public showEvents = true;
	todayAndFutureDays?: Weekday[];
	filterFocused = false;
	allRecurrings?: IRecurringWithUiState[];
	recurrings?: IRecurringWithUiState[];
	activeDayParity: Parity = 'odd';
	activeWeekParity: Parity = 'odd';
	oddDay: SwipeableDay;
	evenDay: SwipeableDay;
	readonly oddWeek: SwipeableWeek;
	readonly evenWeek: SwipeableWeek;
	weekAnimationState?: VirtualSliderAnimationStates = undefined;
	dayAnimationState?: VirtualSliderAnimationStates = undefined;

	filterSegment: 'all' | 'mine' | 'filter' = 'all';

	// nextWeekdays: SlotsGroup[];
	public filter = '';

	get activeDay(): SwipeableDay {
		return this.activeDayParity === 'odd' ? this.oddDay : this.evenDay;
	}

	get activeWeek(): SwipeableWeek {
		return this.activeWeekParity === 'odd' ? this.oddWeek : this.evenWeek;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly params: TeamComponentBaseParams,
		afs: AngularFirestore,
	) {
		this.teamDaysProvider = new TeamDaysProvider(afs);
		const today = new Date();
		const tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		const destroyed = this.destroyed.asObservable();
		this.oddDay = new SwipeableDay('odd', today, this.teamDaysProvider, destroyed);
		this.evenDay = new SwipeableDay('even', tomorrow, this.teamDaysProvider, destroyed);

		this.oddWeek = new SwipeableWeek('odd', this.teamDaysProvider, destroyed);
		this.evenWeek = new SwipeableWeek('even', this.teamDaysProvider, destroyed);


		// setTimeout(() => {
		// 	// TODO: Fix this dirty workaround for initial animations
		// 	this.setToday();
		// }, 10);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			this.onTeamContextChanged();
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
		this.teamDaysProvider.destroy();
	}

	ngAfterViewInit(): void {
		this.tabChanged.emit(this.tab);
	}

	swipeLeft(): void {
		console.log('swipeLeft()');
		switch (this.tab) {
			case 'day':
				this.changeDay(+SHIFT_1_DAY);
				break;
			case 'week':
				// tslint:disable-next-line:no-magic-numbers
				this.changeDay(+SHIFT_1_WEEK);
				break;
			default:
				break;
		}
	}

	swipeRight(): void {
		console.log('swipeRight()');
		switch (this.tab) {
			case 'day':
				this.changeDay(-SHIFT_1_DAY);
				break;
			case 'week':
				// tslint:disable-next-line:no-magic-numbers
				this.changeDay(-SHIFT_1_WEEK);
				break;
			default:
				break;
		}
	}

	segmentChanged(event: Event): void {
		console.log('ScheduleComponent.segmentChanged()', event);
		history.replaceState(history.state, document.title, location.href.replace(/tab=\w+/, `tab=${this.tab}`));
		switch (this.tab) {
			case 'week':
				if (this.activeDay.date) {
					this.setDay('segmentChanged', this.activeDay.date);
				} else {
					throw new Error('activeDay has no date');
				}
				break;
			case 'singles':
				// this.slotsProvider.loadTodayAndFutureEvents(undefined)
				// 	.subscribe({
				// 		error: this.errorLogger.logError,
				// 		next: events => {
				// 			const slotGroupsByDate: { [dateKey: string]: SlotsGroup } = {};
				// 			events.forEach(event => {
				// 				const eventStartDate = new Date(event.dtStarts);
				// 				const dateKey = localDateToIso(eventStartDate);
				// 				let slotGroup = slotGroupsByDate[dateKey];
				// 				if (!slotGroup) {
				// 					const wd = 'we'; // TODO: why Wednesday?
				// 					slotGroupsByDate[dateKey] = slotGroup = {
				// 						wd,
				// 						date: eventStartDate,
				// 						title: wdCodeToWeekdayName(wd),
				// 						slots: [],
				// 					};
				// 				}
				// 				slotGroup.slots.push(eventToSlot(event));
				// 			});
				// 			this.todayAndFutureEvents = Object.values(slotGroupsByDate);
				// 		},
				// 	});
				break;
			default:
				break;
		}
	}

	onShowEventsChanged(): void {
		if (!this.showEvents) {
			this.showRecurrings = true;
		}
	}

	onShowRecurringsChanged(): void {
		if (!this.showRecurrings) {
			this.showEvents = true;
		}
	}

	goNewHappening(params: NewHappeningParams): void {
		const { type, wd, date } = params;

		const state: { type?: HappeningType; date?: string; wd?: WeekdayCode2 } = { type };

		if (date) {
			// tslint:disable-next-line:no-non-null-assertion
			state.date = dateToIso(date);
		} else if (wd) {
			state.wd = wd;
		} else if (this.tab === 'day') {
			if (this.activeDay.date) {
				state.date = dateToIso(this.activeDay.date);
			}
		}
		if (!this.team) {
			this.errorLogger.logError('!this.team');
			return;
		}
		this.params.teamNavService
			.navigateForwardToTeamPage(this.team, 'new-happening', {})
			.then(this.errorLogger.logError);
	}

	goRegular(activity: IRecurringWithUiState): void {
		this.errorLogger.logError('not implemented yet');
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	applyFilter(filter: string): void {
		console.log(`applyFilter(${filter})`);
		this.filter = filter.toLowerCase();
		if (this.tab === 'recurrings') {
			this.recurrings = this.filterRecurrings();
		}
	}

	isToday(): boolean {
		const day = this.activeDay.date;
		const today = new Date();
		return !day ||
			day.getDate() === today.getDate() &&
			day.getMonth() === today.getMonth() &&
			day.getFullYear() === today.getFullYear();
	}

	isTomorrow(): boolean {
		const day = this.activeDay.date;
		const today = new Date();
		return !day ||
			day.getDate() === today.getDate() + 1 &&
			day.getMonth() === today.getMonth() &&
			day.getFullYear() === today.getFullYear();
	}

	isCurrentWeek(): boolean {
		const monday = this.activeWeek && this.activeWeek.startDate;
		const today = new Date();
		return !monday || monday.getTime() === getWeekdayDate(today, 0)
			.getTime();
	}

	changeDay(v: number): void {
		const d = this.activeDay.date;
		console.log(`changeDay(${v}) => segment=${this.tab}, activeDay.date:`, d);
		switch (this.tab) {
			case 'day':
				this.activeDayParity = this.activeDayParity === 'odd' ? 'even' : 'odd';
				this.dayAnimationState = animationState(this.activeDayParity, v);
				break;
			case 'week':
				this.activeWeekParity = this.activeWeekParity === 'odd' ? 'even' : 'odd';
				this.weekAnimationState = animationState(this.activeWeekParity, v);
				break;
			default:
				return;
		}
		if (!d) {
			throw new Error('!d');
		}
		this.setDay('changeDay', new Date(d.getFullYear(), d.getMonth(), d.getDate() + v));
	}

	setToday(): void {
		console.log('ScheduleComponent.setToday()');
		if (!this.activeDay.date) {
			this.errorLogger.logError('!this.activeDay.date');
			return;
		}
		const today = new Date();
		const activeTime = this.activeDay.date.getTime();
		switch (this.tab) {
			case 'day':
				this.activeDayParity = this.activeDayParity === 'odd' ? 'even' : 'odd';
				if (today.getTime() > activeTime) {
					this.dayAnimationState = animationState(this.activeDayParity, +1);
				} else if (today.getTime() < activeTime) {
					this.dayAnimationState = animationState(this.activeDayParity, -1);
				}
				break;
			case 'week':
				this.activeWeekParity = this.activeWeekParity === 'odd' ? 'even' : 'odd';
				if (today.getTime() > activeTime) {
					this.weekAnimationState = animationState(this.activeWeekParity, +1);
				} else if (today.getTime() < activeTime) {
					this.weekAnimationState = animationState(this.activeWeekParity, -1);
				}
				break;
			default:
				break;
		}
		this.setDay('today', today);
	}

	setSlidesAnimationState(): void {
		const isOdd = this.activeDayParity === 'odd';
		switch (this.tab) {
			case 'day':
				this.oddDay.animationState = isOdd ? showVirtualSlide : hideVirtualSlide;
				this.evenDay.animationState = !isOdd ? showVirtualSlide : hideVirtualSlide;
				break;
			case 'week':
				this.oddWeek.animationState = isOdd ? showVirtualSlide : hideVirtualSlide;
				this.evenWeek.animationState = !isOdd ? showVirtualSlide : hideVirtualSlide;
				break;
		}
	}

	onSlotClicked(slot: ISlotItem): void {
		console.log('ScheduleComponent.onSlotClicked()', slot);
		const happeningDto: IHappeningDto | undefined = slot.recurring || slot.single;
		if (!happeningDto) {
			throw new Error('!happeningDto');
		}
		if (!this.team) {
			throw new Error('!team');
		}
		const url = `happening/${happeningDto}`
		const recurring: IRecurringContext = {
			id: slot.happening.id,
			team: this.team,
			brief: slot.happening,
			dto: slot.recurring,
		}
		this.params.teamNavService.navigateForwardToTeamPage(this.team,`recurring/${slot.happening.id}`, {
			state: {recurring},
		})
			.catch(this.errorLogger.logErrorHandler('failed to navigate to recurring happening page'))
	}

	public onDateSelected(date: Date): void {
		this.tab = 'day';
		this.setDay('onDateSelected', date);
	}

	readonly id = (i: number, v: { id: string }): string => v.id;

	// tslint:disable-next-line:prefer-function-over-method
	readonly index = (i: number): number => i;

	// get inactiveDay(): Day {
	//     return this.activeDayParity === 'odd' ? this.evenDay : this.oddDay;
	// }

	// tslint:disable-next-line:prefer-function-over-method
	trackByDate(i: number, item: Weekday): number | undefined {
		return item.day?.date.getTime();
	}

	// noinspection JSMethodCanBeStatic

	protected onTeamIdChanged(): void {
		if (this.team?.id) {
			// this.slotsProvider.setCommuneId(this.team.id)
			// 	.subscribe(
			// 		(regulars) => {
			// 			console.log('Loaded regulars:', regulars);
			// 			this.allRegulars = regulars;
			// 			this.regulars = this.filterRegulars();
			// 		},
			// 		this.errorLogger.logError,
			// 		() => {
			// 			// this.activeWeek.weekdays = [...this.activeWeek.weekdays];
			// 			this.setDay('onCommuneIdChanged', this.activeDay.date || new Date());
			// 		},
			// 	);
		}
	}

	private onTeamContextChanged(): void {
		if (this.team) {
			this.teamDaysProvider.setTeam(this.team);
			this.populateRecurrings();
		}
		if (this.activeDay?.date) {
			this.setDay('onTeamDtoChanged', this.activeDay.date);
		}
	}

	private populateRecurrings(): void {
		console.log('populateRecurrings()');
		const prevAll = this.allRecurrings;
		this.allRecurrings = this.team?.dto?.recurringHappenings?.map(brief => {
			const { id } = brief;
			const prev = prevAll?.find(p => p.id === id);
			const result: IRecurringWithUiState = { id, brief: brief, state: prev?.state || {} };
			return result;
		});
		this.recurrings = this.filterRecurrings();
	}

	// noinspection JSMethodCanBqw2se3333eStatic

	private filterRecurrings(): IRecurringWithUiState[] | undefined {
		console.log(`filterRecurrings(filter='${this.filter}')`, this.allRecurrings);
		const filter = this.filter.toLowerCase();

		if (!filter) {
			return this.allRecurrings;
		}
		return this.allRecurrings?.filter(r => r.brief?.title && r.brief.title.toLowerCase().indexOf(filter) >= 0);
	}

	// noinspection JSMethodCanBeStatic

	private setDay(source: string, d: Date): void {
		console.log(`ScheduleComponent.setDay(source=${source}), d=`, d);
		if (!d) {
			return;
		}

		this.setSlidesAnimationState();

		this.activeDay.changeDate(d);

		this.activeWeek.activeDate = d;
		// const { tab } = this;
		// const activeWd = jsDayToWeekday(d.getDay() as wdNumber);
		// const datesToPreload: Date[] = [];
		// const datesToLoad: Day[] = [];
		// activeWeek.weekdays.forEach((weekday) => {
		// 	const weekdayDate = getWdDate(weekday.wd, activeWd, d);
		// 	if (!weekday.date || weekday.date.getTime() !== weekdayDate.getTime() || !weekday.slots) {
		// 		// console.log('weekday.date !== weekdayDate', weekday.date, weekdayDate);
		// 		weekday = { ...weekday, date: weekdayDate };
		// 		if (tab === 'week' || tab === 'day' && weekday.wd === activeWd) {
		// 			datesToLoad.push(weekday);
		// 			// tslint:disable-next-line:no-magic-numbers
		// 			const diff = tab === 'day' ? SHIFT_1_DAY : SHIFT_1_WEEK;
		// 			const wdDate = weekday.date;
		// 			if (wdDate) {
		// 				datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() + diff));
		// 				datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() - diff));
		// 			}
		// 			if (tab === 'day') {
		// 				const activeWeekDaysToPreload = activeWeek.weekdays
		// 					.filter(wd =>
		// 						!wd.date ||
		// 						// tslint:disable-next-line:no-non-null-assertion
		// 						!datesToPreload.some(dtp => dtp.getTime() === wd.date?.getTime()));
		// 				activeWeekDaysToPreload.forEach(wd => {
		// 					if (!wd.date) {
		// 						// wd.date = weekdayDate;
		// 						// this.errorLogger.logError('not implemented yet: !wd.date');
		// 						console.error('not implemented yet: !wd.date');
		// 					} else {
		// 						datesToPreload.push(wd.date);
		// 					}
		// 				});
		// 			}
		// 		}
		// 	}
		// 	if (weekday.wd === activeWd) {
		// 		this.activeDay.weekday = weekday;
		// 	}
		// });
		//
		// console.log(`segment=${tab}, datesToPreload:`, datesToPreload);
		// if (this.team) {
		// 	this.slotsProvider.getDays(...datesToLoad)
		// 		.pipe(
		// 			takeUntil(this.destroyed),
		// 		)
		// 		.subscribe({
		// 			error: this.errorLogger.logErrorHandler('failed to get days'),
		// 		});
		// }
		// this.slotsProvider.preloadEvents(tx, ...datesToPreload),

		// Change URL
		if (this.isToday()) {
			history.replaceState(history.state, document.title, location.href.replace(/\?date=\d{4}-\d{2}-\d{2}/, ''));
		} else {
			const isoDate = `?date=${localDateToIso(d)}`;
			if (location.href.indexOf('?date') < 0) {
				history.replaceState(history.state, document.title, location.href + isoDate);
			} else {
				history.replaceState(history.state, document.title, location.href.replace(/\?date=\d{4}-\d{2}-\d{2}/, isoDate));
			}
		}
	}

	private onSetDateWhenDayTabIsActive(): void {
		//
	}

	private onSetDateWhenWeekTabIsActive(): void {
		//
	}

	private getDayData(d: Date): void {

	}

	private getWeekData(): void {
		//
	}

	// get inactiveWeek(): Week {
	//     return this.activeWeekParity === 'odd' ? this.evenWeek : this.oddWeek;
	// }
}
