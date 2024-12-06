import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IContactContext } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contact-related-as',
	templateUrl: './contact-related-as.component.html',
	imports: [CommonModule, IonicModule],
})
export class ContactRelatedAsComponent {
	@Input({ required: true }) public contact?: IContactContext;
}
