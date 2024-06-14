import { Injectable, NgModule } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import {
	emptyHappeningSlot,
	IHappeningAdjustment,
	IHappeningSlot,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { SingleSlotFormComponent } from './single-slot-form.component';

@Injectable()
export class HappeningSlotModalService {
	constructor(private readonly modalController: ModalController) {}

	async editSingleHappeningSlot(
		event: Event,
		happening: IHappeningContext,
		recurring?: {
			happeningSlot?: IHappeningSlot;
			dateID: string;
			adjustment?: IHappeningAdjustment;
		},
	): Promise<void> {
		event.stopPropagation();
		event.preventDefault();
		const team = happening.team;
		if (!team) {
			return Promise.reject('no team context');
		}
		const slots = happening?.brief?.slots;
		const happeningSlot =
			recurring?.happeningSlot || (slots && slots[0]) || emptyHappeningSlot;
		const modal = await this.modalController.create({
			component: SingleSlotFormComponent,
			componentProps: {
				team,
				happening,
				happeningSlot,
				adjustment: recurring?.adjustment,
				dateID: recurring?.dateID,
				isModal: true,
			},
		});
		await modal.present();
	}
}

@NgModule({
	imports: [IonicModule],
	providers: [HappeningSlotModalService],
})
export class HappeningSlotModalServiceModule {}
