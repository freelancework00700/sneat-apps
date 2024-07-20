import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

@Component({
	selector: 'sneat-logist-order-print-shipping-doc',
	templateUrl: './order-shipping-doc.component.html',
})
export class OrderShippingDocComponent extends OrderPrintPageBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		orderService: LogistOrderService,
	) {
		super('OrderShippingDocComponent', route, teamParams, orderService);
	}
}
