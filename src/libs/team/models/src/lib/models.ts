import { AgeGroup, Gender, IMemberDto, IPerson, IRelatedPerson, MemberRole, MemberType } from '@sneat/dto';
import { IMemberContext } from './team-context';


export interface ITeamRequest {
	readonly teamID: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
	member: string;
}

export interface IAcceptPersonalInviteRequest extends ITeamRequest {
	invite: string;
	pin: string;
	fullName: string;
	email: string;
}

export interface IRejectPersonalInviteRequest extends ITeamRequest {
	invite: string;
	pin: string;
}


export interface ICreateTeamMemberRequest extends ITeamRequest, IRelatedPerson {
	memberType: MemberType;
	message?: string;
}

export interface IBy {
	memberID?: string;
	userID?: string;
	title: string;
}


interface IInvite {
	message?: string;
}

export interface IInviteFromContact {
	memberID: string;
	title?: string
}

export interface IInviteToContact {
	channel: 'email' | 'sms' | 'link';
	address: string;
	memberID?: string;
	title?: string;
}

export interface IPersonalInvite extends IInvite {
	team: { id: string; title: string };
	memberID: string;
	from: IInviteFromContact;
	to: IInviteToContact;
}

export interface IAddTeamMemberResponse {
	member: IMemberContext;
}

export interface ITaskRequest extends ITeamMemberRequest {
	type: string;
	task: string;
}

export interface IReorderTaskRequest extends ITaskRequest {
	len: number;
	from: number;
	to: number;
	after?: string;
	before?: string;
}
