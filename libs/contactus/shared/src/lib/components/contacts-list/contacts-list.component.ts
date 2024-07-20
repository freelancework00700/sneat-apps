import { Component, Input } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contacts-list',
	templateUrl: './contacts-list.component.html',
})
export class ContactsListComponent {
	@Input() contacts?: IIdAndBrief<IContactBrief>[] = [];
}
