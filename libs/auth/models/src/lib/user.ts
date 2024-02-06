import { EnumAsUnionOfKeys, TeamType } from '@sneat/core';
import { IAvatar } from './avatar';
import { IPersonNames } from './person-names';

// Does not contain an ID as it's a key.
// Use IRecord<IUserRecord> to keep record paired with ID
export interface IUserRecord {
	readonly title: string;
	readonly countryID?: string;
	readonly email?: string;
	readonly emailIsVerified?: boolean;
	readonly avatar?: IAvatar;
	readonly teamIDs?: readonly string[];
	readonly teams?: Record<string, IUserTeamBrief>;
	readonly names?: IPersonNames;
}

export enum TeamMemberTypeEnum {
	creator = 'creator',
	member = 'member',
	pet = 'pet',
	pupil = 'pupil',
	staff = 'staff',
}

export type TeamMemberType = EnumAsUnionOfKeys<typeof TeamMemberTypeEnum>;

export interface IUserTeamBrief {
	readonly title: string;
	readonly type: TeamType;
	readonly roles: string[];
	readonly userContactID: string;
}
