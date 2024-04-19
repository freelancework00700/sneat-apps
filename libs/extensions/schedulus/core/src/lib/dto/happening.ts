import { IPrice, IWithRelatedOnly, IWithTeamIDs } from '@sneat/dto';
import { ActivityType, Repeats, WeekdayCode2 } from './happening-types';

export interface ISlotParticipant {
	readonly roles?: string[];
	// readonly type: 'member' | 'contact';
	// readonly title: string;
}

export interface IHappeningParticipant {
	readonly roles?: string[];
	// readonly type: 'member' | 'contact';
	// readonly title: string;
}

export interface IHappeningBase extends IWithRelatedOnly {
	readonly type: HappeningType;
	readonly status: HappeningStatus;
	readonly kind: HappeningKind;
	readonly activityType?: ActivityType; // TODO: Is it same as HappeningKind?
	readonly title: string;
	readonly levels?: Level[];
	readonly contactIDs?: string[];
	// readonly participants?: Record<string, Readonly<IHappeningParticipant>>;
	slots?: IHappeningSlot[]; // TODO: make readonly
}

export type IHappeningBrief = IHappeningBase;

export interface IWithDates {
	dates?: string[];
}

export interface IWithTeamDates extends IWithTeamIDs, IWithDates {
	readonly teamDates?: string[]; // ISO date strings prefixed with teamID e.g. [`abc123:2019-12-01`, `abc123:2019-12-02`]
}

export interface IHappeningDto extends IHappeningBrief, IWithTeamDates {}

export function validateHappeningDto(dto: IHappeningDto): void {
	if (!dto.title) {
		throw new Error('happening has no title');
	}
	if (dto.title !== dto.title.trim()) {
		throw new Error(
			'happening title has leading or closing whitespace characters',
		);
	}
	switch (dto.type) {
		case 'single':
			break;
		case 'recurring':
			break;
		default:
			if (!dto.type) {
				throw new Error('happening has no type');
			}
			throw new Error('happening has unknown type: ' + dto.type);
	}
	if (!dto.type) {
		throw new Error('happening has no type');
	}
	if (!dto.slots?.length) {
		throw new Error('!dto.slots?.length');
	}
	switch (dto.type) {
		case 'single':
			dto.slots?.forEach(validateSingleHappeningSlot);
			break;
		case 'recurring':
			dto.slots?.forEach(validateRecurringHappeningSlot);
			break;
	}
}

export function validateRecurringHappeningSlot(
	slot: IHappeningSlot,
	index: number,
): void {
	if (slot.repeats === 'once' || slot.repeats === 'UNKNOWN') {
		throw new Error(
			`slots[${index}]: slot.repeats is not valid for recurring happening: ${slot.repeats}`,
		);
	}
	validateHappeningSlot(slot, index);
}

export function validateSingleHappeningSlot(
	slot: IHappeningSlot,
	index: number,
): void {
	if (slot.repeats != 'once') {
		throw new Error(
			`slots[${index}]: slot repeats is not 'once': ${slot.repeats}`,
		);
	}
	validateHappeningSlot(slot, index);
}

function validateHappeningSlot(slot: IHappeningSlot, index: number): void {
	if (!slot.start.time) {
		throw new Error(`slots[${index}]: slot has no start time: ${slot}`);
	}
}

export type HappeningType = 'recurring' | 'single';

export type HappeningStatus = 'draft' | 'active' | 'canceled' | 'archived';

export type HappeningKind = 'appointment' | 'activity' | 'task';

export interface SlotLocation {
	title?: string;
	address?: string;
}

interface IFortnightly {
	title: string;
}

/*
// tslint:disable-next-line:no-magic-numbers
type MonthlyDay = -5 | -4 | -3 | -2 | -1
// tslint:disable-next-line:no-magic-numbers
	| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
// tslint:disable-next-line:no-magic-numbers
	| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
// tslint:disable-next-line:no-magic-numbers
	| 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28;
*/

export interface IDateTime {
	readonly date?: string;
	readonly time: string;
}

export interface ITiming {
	readonly start: IDateTime;
	readonly end?: IDateTime;
	readonly durationMinutes?: number;
}

export interface IHappeningSlotSingleRef {
	repeats: Repeats;
	weekday?: WeekdayCode2;
	week?: number;
}

export interface IHappeningSlotTiming extends ITiming {
	readonly repeats: Repeats;
	readonly weekdays?: WeekdayCode2[];
	readonly weeks?: number[];
	readonly fortnightly?: {
		odd: IFortnightly;
		even: IFortnightly;
	};
}

export type Level = 'beginners' | 'intermediate' | 'advanced';

export interface IHappeningTask {
	readonly serviceProvider?: {
		readonly id: string;
		readonly title: string;
	};
}

export interface IHappeningSlot extends IHappeningSlotTiming {
	readonly id: string;
	readonly location?: SlotLocation;
	readonly groupIds?: string[]; // TODO: What is this?
}

export const emptyTiming: ITiming = {
	start: { date: '', time: '' },
	// durationMinutes: 0,
};

export const emptyHappeningSlot: IHappeningSlot = {
	id: '',
	repeats: 'UNKNOWN',
	...emptyTiming,
};

export interface ISingleHappeningDto extends IHappeningDto {
	readonly dtStarts?: number; // UTC
	readonly dtEnds?: number; // UTC
	readonly weekdays?: WeekdayCode2[];
	readonly prices?: IPrice[];
}

export interface DtoSingleTask extends ISingleHappeningDto {
	isCompleted: boolean;
	completion?: number; // In percents, max value is 100.
}
