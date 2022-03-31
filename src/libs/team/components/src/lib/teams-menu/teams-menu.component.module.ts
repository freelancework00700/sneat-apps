import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TeamComponentContextModule } from '../team-page-context';
import { FormsModule } from '@angular/forms';
import { TeamsMenuComponent } from './teams-menu.component';
import { RouterModule } from '@angular/router';

const exports = [TeamsMenuComponent];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		TeamComponentContextModule,
		RouterModule,
	],
	declarations: [...exports],
	exports,
})
export class TeamsMenuComponentModule {
}

