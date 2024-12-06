import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IIdAndBriefAndOptionalDto } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contact-contacts',
	templateUrl: 'contact-contacts.component.html',
	imports: [CommonModule, IonicModule],
})
export class ContactContactsComponent {
	@Input({ required: true }) public contact?: IIdAndBriefAndOptionalDto<
		IContactBrief,
		IContactBrief
	>;
}
