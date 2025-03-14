import { Component, Input } from '@angular/core';
import { IRecord } from '@sneat/data';
import { IRetrospective } from '@sneat/scrumspace-scrummodels';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-retro-review-stage',
	templateUrl: './retro-review-stage.component.html',
	standalone: false,
})
export class RetroReviewStageComponent {
	@Input({ required: true }) space: ISpaceContext = { id: '' };
	@Input({ required: true }) retrospective?: IRecord<IRetrospective>;
}
