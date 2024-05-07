import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	Output,
} from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { HappeningType } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { TeamDaysProvider } from '../../../../pages/calendar';
import { ScheduleNavService } from '@sneat/extensions/schedulus/shared';
import {
	IHappeningSlotUiItem,
	NewHappeningParams,
} from '@sneat/extensions/schedulus/shared';
import { getToday, ScheduleStateService } from '../../schedule-state.service';
import { swipeableDay } from '../../../swipeable-ui';
import { ScheduleDayBaseComponent } from './schedule-day-base.component';

// This is 1 of the 2 "day cards" used at ScheduleDayTabComponent
// The 1st is the "active day" (e.g. today), and the 2nd is "next day" (e.g. tomorrow).
// The 2nd should set the [activeDayPlus]="1"
@Component({
	selector: 'sneat-schedule-day-card',
	templateUrl: 'schedule-day-card.component.html',
	animations: virtualSliderAnimations,
})
export class ScheduleDayCardComponent
	extends ScheduleDayBaseComponent
	implements AfterViewInit
{
	@Input() team: ITeamContext = { id: '' };
	@Input() teamDaysProvider?: TeamDaysProvider;
	@Output() goNew = new EventEmitter<NewHappeningParams>();

	@Input() set activeDayPlus(value: number) {
		this.shiftDays = value;
		console.log('set activeDayPlus()', value, 'shiftDays=', this.shiftDays);
	}

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		scheduleSateService: ScheduleStateService,
		private readonly scheduleNavService: ScheduleNavService, // private readonly teamDaysProvider: TeamDaysProvider,
	) {
		super('ScheduleDayCardComponent', errorLogger, scheduleSateService);
	}

	@Input() onSlotClicked?: (args: {
		slot: IHappeningSlotUiItem;
		event: Event;
	}) => void = () => {
		throw new Error('onSlotClicked not set');
	};

	ngAfterViewInit(): void {
		console.log('ngAfterViewInit(), shiftDays=', this.shiftDays);
		if (this.shiftDays < 0) {
			throw new Error('shiftDays < 0');
		}
		this.createSlides();
	}

	protected newHappeningUrl(type: HappeningType): string {
		// TODO: Should use some shared func to get URL
		return `space/${this.team?.type}/${this.team?.id}/new-happening?type=${type}&wd=${this.activeDay?.weekday?.id}&date=${this.activeDay?.activeDateID}`;
	}

	protected goNewHappening(type: HappeningType): boolean {
		if (!this.team) {
			return false;
		}
		const params: NewHappeningParams = {
			type,
			wd: this.activeDay?.weekday?.id,
			date: this.activeDay?.activeDateID,
		};
		this.scheduleNavService.goNewHappening(this.team, params);
		return false;
	}

	private createSlides(): void {
		if (!this.teamDaysProvider) {
			throw new Error('!this.teamDaysProvider');
		}
		const current = getToday();
		if (this.activeDayPlus) {
			current.setDate(current.getDate() + this.activeDayPlus);
		}
		this.date = current;
		const next = new Date();
		next.setDate(this.date.getDate() + 1);
		const destroyed = this.destroyed.asObservable();
		this.oddSlide = swipeableDay(
			'odd',
			current,
			this.teamDaysProvider,
			destroyed,
		);
		this.evenSlide = swipeableDay(
			'even',
			next,
			this.teamDaysProvider,
			destroyed,
		);
		this.onDateChanged({ date: current, shiftDirection: '' });
	}
}
