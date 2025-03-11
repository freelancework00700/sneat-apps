import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ISelectItem, SelectFromListModule } from '@sneat/components';
import { PetKind } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-pet-kind',
	templateUrl: './pet-kind-input.component.html',
	imports: [CommonModule, IonicModule, SelectFromListModule],
})
export class PetKindInputComponent {
	@Input({ required: true }) petKind?: PetKind;

	@Output() readonly petKindChange = new EventEmitter<PetKind | undefined>();

	protected readonly petKinds: ISelectItem[] = [
		{ id: 'dog', emoji: '🐕', title: 'Dog' },
		{ id: 'cat', emoji: '🐈', title: 'Cat' },
		{ id: 'bird', emoji: '🐦', title: 'Bird' },
		{ id: 'fish', emoji: '🐠', title: 'Fish' },
		{ id: 'mouse', emoji: '🐭', title: 'Mouse' },
		{ id: 'rat', emoji: '🐁', title: 'Rat' },
		{ id: 'hamster', emoji: '🐹', title: 'Hamster' },
		{ id: 'horse', emoji: '🐴', title: 'Horse' },
		{ id: 'turtle', emoji: '🐢', title: 'Turtle' },
		{ id: 'snake', emoji: '🐍', title: 'Snake' },
		{ id: 'lizard', emoji: '🦎', title: 'Lizard' },
	];

	protected onChanged(id: string): void {
		this.petKindChange.emit(id as PetKind);
	}
}
