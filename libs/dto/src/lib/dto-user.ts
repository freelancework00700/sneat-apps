// import { MemberRelationship } from './dto-member';
import { ITitledRecord } from './dto-models';
import { ICommuneDto } from './dto-commune';
import { CommuneType, CountryId } from './types';

export interface IUserCommuneInfo {
	id?: string;
	shortId?: string;
	title?: string;
	type: CommuneType;
	// members?: {
	// 	[id: string]: {
	// 		relatedAs: MemberRelationship;
	// 		// title?: string;
	// 	};
	// };
}

export function createUserCommuneInfoFromCommuneDto(
	communeDto: ICommuneDto,
	shortId?: string,
): IUserCommuneInfo {
	return {
		id: communeDto.id,
		shortId,
		title: communeDto.title,
		type: communeDto.type,
	};
}

export interface IUserDto extends ITitledRecord {
	countryIds?: CountryId[];
	created: {
		hostOrApp: string;
		at: string;
	};
	readonly communes?: readonly IUserCommuneInfo[]; // Returns real ID and Title, find by shortId
	communesCount?: number;
	isAnonymous: boolean;
	isDemo?: boolean;
	autogeneratedPassword?: string;
	emailVerified?: boolean;
	email?: string;
	emailOriginal?: string;
	gender?: 'male' | 'female' | 'undisclosed';
}

export function addCommuneToUserDto(
	userDto: IUserDto,
	communeInfo: IUserCommuneInfo,
): IUserDto {
	const communes = userDto.communes || [];
	if (
		communeInfo.id &&
		communes.find((c) => !!c.id && !!communeInfo.id && c.id === communeInfo.id)
	) {
		throw new Error(`Can't add commune with duplicate id: ${communeInfo.id}`);
	}
	return {
		...userDto,
		communes: [...communes, communeInfo],
		communesCount: communes.length + 1,
	};
}

export class UserModel {
	public static getCommuneInfoByShortId(
		id: string,
		communes?: readonly IUserCommuneInfo[],
	): IUserCommuneInfo | undefined {
		return communes && communes.find((c) => c.shortId === id);
	}

	public static getCommuneInfoById(
		id: string,
		communes: readonly IUserCommuneInfo[],
	): IUserCommuneInfo | undefined {
		const ci =
			communes && communes.find((c) => c.shortId === id || c.id === id);
		if (!ci && id === 'family') {
			return { type: 'family', shortId: 'family', title: 'Family' };
		}
		return ci;
	}
}
