import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdersGridComponent } from './orders-grid.component';

describe('FreightsListComponent', () => {
	let component: OrdersGridComponent;
	let fixture: ComponentFixture<OrdersGridComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [OrdersGridComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(OrdersGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
