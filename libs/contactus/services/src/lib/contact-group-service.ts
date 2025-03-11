import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IIdAndDbo } from '@sneat/core';
import {
	IContactGroupBrief,
	IContactGroupDbo,
	IContactRoleBriefWithID,
} from '@sneat/contactus-core';
import { ISpaceContext, ISpaceRef } from '@sneat/team-models';
import { ModuleSpaceItemService } from '@sneat/team-services';
import { Observable, of } from 'rxjs';

const contactTypeFamilyMember: IContactRoleBriefWithID = {
		id: 'member',
		title: 'Family member',
		emoji: '👪',
	},
	contactTypeRelative: IContactRoleBriefWithID = {
		id: 'relative',
		title: 'Relative',
		emoji: '👪',
	},
	contactTypeTeacher: IContactRoleBriefWithID = {
		id: 'teacher',
		title: 'Teacher',
		emoji: '👩‍🏫',
	},
	contactTypeBabysitter: IContactRoleBriefWithID = {
		id: 'babysitter',
		title: 'Babysitter',
		emoji: '👧',
		finder: 'babysitters.express',
	},
	contactTypeFriendOfKid: IContactRoleBriefWithID = {
		id: 'friend',
		title: 'Friend',
		emoji: '🚸',
	},
	// contactTypeGP: IContactRoleBrief = { id: 'gp', title: 'Family doctor', emoji: '👩‍⚕️', finder: 'gpconnect.app' },
	contactTypePlumber: IContactRoleBriefWithID = {
		id: 'plumber',
		title: 'Plumber',
		emoji: '🚽',
		finder: 'plumbers.express',
	},
	contactTypeElectrician: IContactRoleBriefWithID = {
		id: 'electrician',
		title: 'Electrician',
		emoji: '🔌',
		finder: 'electricians.express',
	},
	contactTypeHandyman: IContactRoleBriefWithID = {
		id: 'handyman',
		title: 'Handyman',
		emoji: '🔨',
	},
	contactTypeGardener: IContactRoleBriefWithID = {
		id: 'gardener',
		title: 'Gardener',
		emoji: '👨‍🌾',
		finder: 'gardeners.express',
	},
	contactTypeInsurer: IContactRoleBriefWithID = {
		id: 'insurer',
		title: 'Insurer',
		emoji: '🧾',
	},
	contactTypeMechanic: IContactRoleBriefWithID = {
		id: 'mechanic',
		title: 'Mechanic',
		emoji: '👨‍🔧',
	};

export const defaultFamilyContactGroupDTOs: readonly IIdAndDbo<IContactGroupDbo>[] =
	[
		{
			id: 'family',
			dbo: {
				emoji: '👪',
				title: 'Family',
				roles: [
					contactTypeFamilyMember,
					contactTypeRelative,
					contactTypeFriendOfKid,
				],
			},
		},
		{
			id: 'kid',
			dbo: {
				emoji: '🚸',
				title: 'Kids',
				roles: [
					contactTypeTeacher,
					contactTypeBabysitter,
					contactTypeFriendOfKid,
				],
			},
		},
		{
			id: 'house',
			dbo: {
				emoji: '🏠',
				title: 'House',
				roles: [
					contactTypeHandyman,
					contactTypePlumber,
					contactTypeElectrician,
					contactTypeGardener,
					contactTypeInsurer,
				],
			},
		},
		{
			id: 'med',
			dbo: {
				emoji: '⚕️',
				title: 'Medical',
				roles: [
					{ id: 'gp', title: 'GP / Family doctor', emoji: '🩺' },
					{ id: 'med_specialist', title: 'Medical specialist', emoji: '🥼' },
				],
			},
		},
		{
			id: 'vehicle',
			dbo: {
				emoji: '🚗',
				title: 'Vehicle',
				roles: [contactTypeMechanic, contactTypeInsurer],
			},
		},
	];

export const defaultFamilyContactGroups: readonly IIdAndDbo<IContactGroupDbo>[] =
	defaultFamilyContactGroupDTOs.map((cg) => ({ ...cg, brief: cg.dbo }));

@Injectable()
export class ContactGroupService {
	private readonly spaceItemService: ModuleSpaceItemService<
		IContactGroupBrief,
		IContactGroupDbo
	>;

	constructor(afs: AngularFirestore, sneatApiService: SneatApiService) {
		this.spaceItemService = new ModuleSpaceItemService(
			'contactus',
			'contact_groups',
			afs,
			sneatApiService,
		);
	}

	getContactGroups(): Observable<readonly IIdAndDbo<IContactGroupDbo>[]> {
		return of(defaultFamilyContactGroupDTOs);
	}

	getContactGroupByID(
		id: string,
		space: ISpaceContext,
	): Observable<IIdAndDbo<IContactGroupDbo>> {
		const cg = defaultFamilyContactGroups.find((cg) => cg.id === id);
		if (!cg) {
			return of({ id, space, dbo: { title: id } });
		}
		return of(cg);
	}

	watchMemberGroupsBySpace(
		space: ISpaceRef,
		status: 'active' | 'archived' = 'active',
	): Observable<IIdAndDbo<IContactGroupDbo>[]> {
		// console.log('watchMemberGroupsByTeamID()', teamID);
		return this.spaceItemService.watchModuleSpaceItemsWithSpaceRef(space, {
			filter: [{ field: 'status', operator: '==', value: status }],
		});
	}
}
