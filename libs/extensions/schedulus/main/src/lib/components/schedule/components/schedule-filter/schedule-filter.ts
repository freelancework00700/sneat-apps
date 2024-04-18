import { WeekdayCode2, IHappeningContext } from '@sneat/mod-schedulus-core';

export interface IScheduleFilter {
	readonly text: string;
	readonly contactIDs: readonly string[];
	readonly weekdays: readonly WeekdayCode2[];
	readonly repeats: readonly string[];
	readonly showRecurrings: boolean;
	readonly showSingles: boolean;
}

// export function areSameFilters(f1: IScheduleFilter, f2: IScheduleFilter): boolean {
// 	return f1 === f2 || f1.text == f2.text && f1.memberIDs
//
// }

export function isMatchingScheduleFilter(
	h: IHappeningContext,
	f?: IScheduleFilter,
): boolean {
	if (!f) {
		return true;
	}
	if (f.text && !h.dto?.title?.toLowerCase().includes(f.text)) {
		return false;
	}
	return !(
		f.contactIDs.length &&
		!f.contactIDs.some(
			(fmID) =>
				(fmID === '' && !Object.keys(h.dto?.participants || {}).length) ||
				h.dto?.contactIDs?.some((hmID) => hmID == fmID),
		)
	);
}
