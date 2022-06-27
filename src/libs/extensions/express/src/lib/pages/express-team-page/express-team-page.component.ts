import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';
import { takeUntil } from 'rxjs';
import { IExpressTeamContext } from '../../dto/express-team-dto';
import { ExpressTeamService } from '../../services/express-team.service';

@Component({
	selector: 'sneat-express-main-page',
	templateUrl: './express-team-page.component.html',
	styleUrls: ['./express-team-page.component.scss'],
})
export class ExpressTeamPageComponent extends TeamBaseComponent {
	expressTeam?: IExpressTeamContext;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly expressTeamService: ExpressTeamService,
	) {
		super('', route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		if (this.team?.id) {
			this.expressTeamService.watchExpressTeamByID(this.team.id)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: expressTeam => {
						this.expressTeam = expressTeam;
					},
					error: this.errorLogger.logErrorHandler('failed to load express team'),
				});

		}
	}
}
