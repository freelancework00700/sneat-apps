import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewCommunePageComponent } from './new-commune-page.component';

describe('NewCommunePageComponent', () => {
	let component: NewCommunePageComponent;
	let fixture: ComponentFixture<NewCommunePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [NewCommunePageComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewCommunePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
