import { INavContext } from '@sneat/core';
import { IContact2Asset } from './dto-contact2';
import { IDemoRecord, ITeamRecord, ITitled, ITitledRecord, ITotalsHolder } from './dto-models';
import { AssetType, CountryId, FuelType, LiabilityServiceType, VehicleType } from './types';

export interface AssetLiabilityInfo {
	id: string;
	serviceTypes?: LiabilityServiceType[];
	serviceProvider?: {
		id: string;
		title: string;
	};
}

export interface ISubAssetInfo extends ITitledRecord {
	type: AssetType;
	countryId?: CountryId;
	subType: string;
	expires?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IAssetBase extends ITitled {
	type: AssetType;
	regNumber?: string;
}

export interface IAssetBrief extends IAssetBase {
	id: string;
}

export interface IAssetDto extends IAssetBase, IDemoRecord, ITotalsHolder {
	type: AssetType;
	parentAssetID?: string;
	parentCategoryID?: AssetType;
	sameAssetID?: string; // A link to realtor's or tenant's asset ID
	desc?: string;
	countryID?: CountryId;
	teamId?: string;
	groupId?: string;
	yearOfBuild?: number;
	dateOfBuild?: string; // ISO date string 'YYYY-MM-DD'
	subAssets?: ISubAssetInfo[];
	contacts?: IContact2Asset[];
	memberIDs?: string[];
	membersInfo?: ITitledRecord[];
	subType?: string; // E.g. subcategory - for example for documents could be: passport, visa, etc.
	number?: string;
	liabilities?: AssetLiabilityInfo[];
	notUsedServiceTypes?: LiabilityServiceType[];
}

export type IAssetContext = INavContext<IAssetBrief, IAssetDto>;

export interface IDwelling extends IAssetDto {
	address?: string;
	rent?: 'landlord' | 'tenant';
}

export interface IVehicle extends IAssetDto {
	make?: string;
	model?: string;
	engine?: string;
	engineCC?: number;
	fuelType?: FuelType;
	vin?: string;
	vehicleType?: VehicleType;
	number?: string;
	nctExpires?: string;     // ISO date string 'YYYY-MM-DD'
	nctExpiresTaskId?: string;
	taxExpires?: string;     // ISO date string 'YYYY-MM-DD'
	taxExpiresTaskId?: string;
	nextServiceDue?: string; // ISO date string 'YYYY-MM-DD'
	nextServiceDueTaskId?: string;
}

export interface IDocument extends IAssetDto {
	issuedOn?: string; // ISO date string 'YYYY-MM-DD'
	issuedBy?: string;
	expiresOn?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IAssetDtoCategory extends ITitledRecord {
	id: AssetType;
	order: number;
	desc?: string;
	canHaveIncome: boolean;
	canHaveExpense: boolean;
}

export interface IAssetDtoGroupCounts {
	assets?: number;
}

export interface IAssetDtoGroup extends ITeamRecord, ITitledRecord, ITotalsHolder {
	order: number;
	desc?: string;
	categoryId?: AssetType;
	numberOf?: IAssetDtoGroupCounts;
}
