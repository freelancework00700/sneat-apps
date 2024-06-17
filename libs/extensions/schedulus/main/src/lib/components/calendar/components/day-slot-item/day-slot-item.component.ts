import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverController, PopoverOptions } from '@ionic/angular';
import { IContactusTeamDtoAndID } from '@sneat/contactus-core';
import { IHappeningSlotUiItem } from '@sneat/extensions/schedulus/shared';
import { ITeamContext } from '@sneat/team-models';
import { SlotContextMenuComponent } from '../slot-context-menu/slot-context-menu.component';
import { HappeningUIState } from '@sneat/mod-schedulus-core';

@Component({
	selector: 'sneat-day-slot-item',
	templateUrl: './day-slot-item.component.html',
})
export class DaySlotItemComponent {
	@Input() public slot?: IHappeningSlotUiItem;

	@Input() dateID?: string;

	@Input() mode: 'full' | 'brief' = 'full';
	@Input() color?: 'light';

	@Input() team: ITeamContext = { id: '' };
	@Input() contactusTeam?: IContactusTeamDtoAndID;

	@Output() readonly slotClicked = new EventEmitter<{
		slot: IHappeningSlotUiItem;
		event: Event;
	}>();

	slotState?: HappeningUIState;

	get isCanceled(): boolean {
		return (
			!!this.slot?.adjustment?.cancellation ||
			this.slot?.happening?.brief?.status === 'canceled'
		);
	}

	constructor(private readonly popoverController: PopoverController) {}

	onSlotClicked(event: Event): void {
		console.log('DaySlotItemComponent.onSlotClicked()');
		if (!this.slot) {
			return;
		}
		this.slotClicked.emit({ slot: this.slot, event });
	}

	async showContextMenu(
		event:
			| MouseEvent
			| TouchEvent
			| PointerEvent
			| CustomEvent<unknown>
			| undefined,
	): Promise<void> {
		// const stateOutput = new EventEmitter<SlotContextState>();
		//
		// stateOutput.subscribe({
		// 	next: (slotState: SlotContextState) => {
		// 		this.slotState = slotState;
		// 	},
		// });
		event?.preventDefault();
		event?.stopPropagation();

		const popoverOptions: PopoverOptions = {
			component: SlotContextMenuComponent,
			componentProps: {
				team: this.team,
				slot: this.slot,
				dateID: this.dateID,
				// state: stateOutput,
			},
			event,
		};

		const popover = await this.popoverController.create(popoverOptions);
		await popover.present(event);
	}
}
