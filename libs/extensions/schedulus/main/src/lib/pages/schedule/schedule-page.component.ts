import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { virtualSliderAnimations } from '@sneat/components';
import { HappeningType } from '@sneat/dto';
import {
	NewHappeningParams,
	ScheduleNavService,
} from '@sneat/extensions/schedulus/shared';
import {
	emptyScheduleFilter,
	ScheduleFilterService,
} from '../../components/schedule-filter.service';
import { IScheduleFilter } from '../../components/schedule-filter/schedule-filter';
import { ScheduleTab } from '../../components/schedule/schedule.component';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team/components';
import { IMemberContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-schedule-page',
	templateUrl: './schedule-page.component.html',
	styleUrls: ['./schedule-page.component.scss'],
	providers: [TeamComponentBaseParams],
	animations: virtualSliderAnimations,
})
export class SchedulePageComponent extends TeamBaseComponent {
	public tab: ScheduleTab = 'day';
	public date = '';
	member?: IMemberContext;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private filterService: ScheduleFilterService,
		private readonly scheduleNavService: ScheduleNavService,
	) {
		super('SchedulePageComponent', route, params);

		filterService.filter.subscribe({
			next: (filter) => {
				this.filter = filter;
			},
		});

		this.route?.queryParamMap.subscribe({
			next: this.onQueryParamsChanged,
		});
	}

	private filter: IScheduleFilter = emptyScheduleFilter;

	private readonly onQueryParamsChanged = (queryParams: ParamMap) => {
		const tab = queryParams.get('tab') as ScheduleTab;
		if (tab) {
			switch (tab) {
				case 'day':
				case 'week':
				case 'recurrings':
				case 'singles':
					this.tab = tab;
					break;
				default:
					// history.replaceState(history.state, document.title, `${location.href}?tab=${this.tab}`);
					break;
			}
		}
		const date = queryParams.get('date');
		if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
			this.date = date;
			// this.activeDay.date = isoStringsToDate(date);
		}
		const memberID = queryParams.get('member');
		if (memberID) {
			this.filterService.next({ ...this.filter, memberIDs: [memberID] });
		}
	};

	onTabChanged(tab: ScheduleTab): void {
		this.tab = tab;
		let { href } = location;
		if (href.indexOf('?') < 0) {
			href += '?tab=';
		}
		href = href.replace(/tab=\w*/, `tab=${this.tab}`);
		history.replaceState(history.state, document.title, href);
	}

	onDateChanged(date: string): void {
		this.date = date;
	}

	goNew(type: HappeningType): void {
		if (!this.team) {
			return;
		}
		const params: NewHappeningParams = { type: type };
		this.scheduleNavService.goNewHappening(this.team, params);
	}
}
