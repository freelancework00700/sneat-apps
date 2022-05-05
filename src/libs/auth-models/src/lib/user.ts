import { EnumAsUnionOfKeys } from '@sneat/core';
import { IAvatar } from './avatar';

// Does not contain an ID as it's a key.
// Use IRecord<IUserRecord> to keep record paired with ID
export interface IUserRecord {
	readonly title: string;
	readonly email?: string;
	readonly emailIsVerified?: boolean;
	readonly avatar?: IAvatar;
	readonly teams?: IUserTeamBrief[];
}

export type TeamType =
	'family'
	| 'personal'
	| 'company'
	| 'team'
	| 'parish'
	| 'educator'
	| 'realtor'
	| 'sport_club'
	| 'cohabit'
	| 'unknown';

export enum TeamMemberType {
	creator = 'creator',
	member = 'member',
	child = 'child',
	pet = 'pet',
	pupil = 'pupil',
	staff = 'staff',
}

export type MemberType = EnumAsUnionOfKeys<typeof TeamMemberType>;

export const memberTypePlurals: { [id: string]: string } = {
	'member': 'members',
	'child': 'children',
	'pet': 'pets',
};

export interface IUserTeamBrief {
	readonly id: string;
	readonly teamType: TeamType;
	// readonly memberType: MemberType; -- replaced with roles
	readonly roles: string[];
	readonly title: string;
	// retroItems?: { [type: string]: IRetroItem[] };
}
