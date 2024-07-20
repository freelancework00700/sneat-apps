import { ActivatedRoute } from '@angular/router';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { ILogistSpaceContext } from '../dto';
import { LogistTeamService } from '../services';

export class LogistTeamBaseComponent extends SpaceBaseComponent {
	protected logistTeam?: ILogistSpaceContext;

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		private readonly logistTeamService: LogistTeamService,
	) {
		super(className, route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		const space = this.team;
		if (space?.id) {
			this.logistTeamService
				.watchLogistTeamByID(space.id)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: (logistTeam) => {
						console.log('logistTeam:', logistTeam);
						this.logistTeam = logistTeam;
					},
					error: (err) => {
						this.errorLogger.logError(err, 'failed to load logist team', {
							show: !('' + err).includes('Missing or insufficient permissions'), // TODO: fix & handle properly
						});
						this.logistTeam = { id: space.id };
					},
				});
		}
	}
}
