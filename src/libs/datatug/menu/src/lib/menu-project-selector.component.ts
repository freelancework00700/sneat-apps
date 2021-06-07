import {Component, Inject, Input} from "@angular/core";
import {IDatatugProjectBase} from "@sneat/datatug/models";
import {ModalController, PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugNavContextService, DatatugNavService} from "@sneat/datatug/services/nav";
import {NewProjectFormComponent} from "./new-project-form.component";

@Component({
	selector: 'datatug-menu-project-selector',
	templateUrl: 'menu-project-selector.component.html'
})
export class MenuProjectSelectorComponent {
	@Input() currentStoreId?: string;
	@Input() currentProjectId?: string;
	@Input() projects?: IDatatugProjectBase[];

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly nav: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
	) {
	}

	public newProject(event: Event): void {
		console.log('newProject()', event);
		this.popoverController.create({
			component: NewProjectFormComponent,
			cssClass: 'small-popover',
			componentProps: {
				onCancel: () => this.popoverController.dismiss().catch(this.errorLogger.logErrorHandler('failed to dismiss popover on cancel')),
			}
		})
			.then(popover => {
				popover.present().catch(this.errorLogger.logErrorHandler('Failed to present modal'));
			})
			.catch(this.errorLogger.logErrorHandler('Failed to create modal:'))
	}

	switchProject(event: CustomEvent): void {
		try {
			const projectId: string = event.detail.value;
			if (!projectId) {
				return;
			}
			console.log('DatatugMenuComponent.switchProject', projectId);
			if (!this.currentStoreId) {
				console.log('project changed but there is no store');
				return;
			}
			const project = this.projects?.find(p => p.id === projectId);
			if (!project) {
				return;
			}
			this.datatugNavContextService.setCurrentProject({
				storeId: this.currentStoreId,
				brief: {
					...project,
					id: projectId,
					store: {type: 'agent'},
				},
				projectId,
			});
			if (projectId) {
				this.nav.goProject(this.currentStoreId, projectId);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle project switch');
		}
	}

}
