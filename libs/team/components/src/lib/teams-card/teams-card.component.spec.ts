import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamsCardComponent } from './teams-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpaceService } from '@sneat/team-services';

describe('TeamsCardComponent', () => {
	let component: TeamsCardComponent;
	let fixture: ComponentFixture<TeamsCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [TeamsCardComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
			],
			providers: [SpaceService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(TeamsCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
