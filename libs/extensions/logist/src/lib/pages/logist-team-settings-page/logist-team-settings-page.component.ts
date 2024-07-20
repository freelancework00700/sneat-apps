import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { LogistTeamService } from '../../services';
import { LogistTeamBaseComponent } from '../logist-team-base.component';

@Component({
	selector: 'sneat-logist-team-settings-page',
	templateUrl: 'logist-team-settings-page.component.html',
})
export class LogistTeamSettingsPageComponent extends LogistTeamBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		logistTeamService: LogistTeamService,
	) {
		super(
			'LogistTeamSettingsPageComponent',
			route,
			teamParams,
			logistTeamService,
		);
	}
}
