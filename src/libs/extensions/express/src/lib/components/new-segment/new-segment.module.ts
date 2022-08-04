import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { OrderContainersSelectorModule } from '../order-containers-selector/order-containers-selector.module';
import { OrderFormModule } from '../order-form.module';
import { NewSegmentComponent } from './new-segment.component';
import { NewSegmentService } from './new-segment.service';
import { SegmentCounterpartyComponent } from './segment-counterparty.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DialogHeaderModule,
    ContactInputModule,
    FormsModule,
    OrderFormModule,
    OrderContainersSelectorModule,
  ],
	declarations: [
		NewSegmentComponent,
		SegmentCounterpartyComponent,
	],
	exports: [
		NewSegmentComponent,
	],
	providers: [
		NewSegmentService,
	]
})
export class NewSegmentModule {
}
