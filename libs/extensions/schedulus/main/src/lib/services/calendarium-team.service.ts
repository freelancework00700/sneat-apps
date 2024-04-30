import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { ICalendariumTeamDto } from '@sneat/mod-schedulus-core';
import { TeamModuleService } from '@sneat/team-services';

@Injectable()
export class CalendariumTeamService extends TeamModuleService<ICalendariumTeamDto> {
	public constructor(afs: AngularFirestore) {
		super('calendarium', afs);
	}
}
