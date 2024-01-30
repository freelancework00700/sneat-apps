import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectPageRoutingModule } from './project-routing.module';
import { ProjectPageComponent } from './project-page.component';
import { SneatCardListModule } from '@sneat/components';
import { WormholeModule } from '@sneat/wormhole';
import { DatatugComponentsProjectModule } from '@sneat/datatug/components/project';
import { DatatugServicesNavModule } from '@sneat/datatug-services-nav';
import { DatatugCoreModule } from '@sneat/datatug-core';
import { DatatugServicesProjectModule } from '@sneat/datatug-services-project';
import { DatatugServicesUnsortedModule } from '@sneat/datatug-services-unsorted';
import { DatatugServicesStoreModule } from '@sneat/datatug-services-repo';
import { DatatugFoldersUiModule } from '@sneat/datatug/folders/ui';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		//
		DatatugComponentsProjectModule,
		DatatugCoreModule,
		DatatugServicesNavModule,
		DatatugServicesProjectModule,
		DatatugServicesStoreModule,
		DatatugServicesUnsortedModule,
		ProjectPageRoutingModule,
		SneatCardListModule,
		WormholeModule,
		DatatugFoldersUiModule,
	],
	declarations: [ProjectPageComponent],
})
export class ProjectPageModule {}
