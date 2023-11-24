import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdersListComponent } from './orders-list.component';

describe('FreightsListComponent', () => {
	let component: OrdersListComponent;
	let fixture: ComponentFixture<OrdersListComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [OrdersListComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(OrdersListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
