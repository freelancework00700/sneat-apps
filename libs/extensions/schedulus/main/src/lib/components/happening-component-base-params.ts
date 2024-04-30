import { Injectable, NgModule } from '@angular/core';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { HappeningService } from '@sneat/team-services';

@Injectable()
export class HappeningComponentBaseParams {
	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly happeningService: HappeningService,
	) {}
}

@NgModule({
	providers: [HappeningComponentBaseParams, TeamComponentBaseParams],
})
export class HappeningComponentBaseParamsModule {}
