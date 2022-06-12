import { DeleteOperationState } from '@sneat/core';
import { HappeningKind, HappeningStatus, HappeningType, IHappeningBrief, IHappeningDto, UiState } from '@sneat/dto';
import { ITeamContext } from './team-context';
import { ITeamItemContext } from './team-item-context';

export type IHappeningContext = ITeamItemContext<IHappeningBrief, IHappeningDto>;

export interface IHappeningWithUiState extends IHappeningContext {
	readonly state: UiState;
}

export function newEmptyHappeningContext(team: ITeamContext, type: HappeningType, kind: HappeningKind, status: HappeningStatus): IHappeningContext {
	const brief: IHappeningBrief = {
		id: '',
		type,
		kind,
		status,
		title: '',
	};
	return {id: '', team, brief, dto: {...brief}};
}

export type CancelOperationState = 'canceling' | 'canceled' | undefined;
export type HappeningUIState = DeleteOperationState | CancelOperationState | undefined;
