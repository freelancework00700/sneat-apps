import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMemberContext } from '@sneat/contactus-core';
import { AssetService } from '@sneat/extensions/assetus/components';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import {
	IAssetContext,
	IAssetDocumentContext,
	IAssetDocumentExtra,
} from '@sneat/mod-assetus-core';

@Component({
	selector: 'sneat-documents-page',
	templateUrl: './documents-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class DocumentsPageComponent extends TeamBaseComponent {
	public segment: 'type' | 'owner' | 'list' = 'type';

	public documents: IAssetDocumentContext[];
	public rootDocs?: IAssetDocumentContext[];
	filter = '';

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private assetService: AssetService,
	) {
		super('DocumentsPageComponent', route, params);
		this.documents = window.history.state.documents as IAssetContext<
			'document',
			IAssetDocumentExtra
		>[];
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		this.loadDocuments();
	}

	loadDocuments() {
		console.log('DocumentsPage.loadDocuments()');
		if (this.team?.id) {
			this.assetService
				.watchTeamAssets<'document', IAssetDocumentExtra>(this.team)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: (documents) => {
						this.documents = documents;
					},
				});
		}
	}

	public goType(type: string) {
		console.log(`goType(${type})`);
	}

	public goDoc(doc: IAssetDocumentContext) {
		if (!this.team) {
			this.errorLogger.logError(
				'not able to navigate to document without team context',
			);
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, `document/${doc.id}`, {
				state: { doc },
			})
			.catch(this.errorLogger.logError);
	}

	goNewDoc = (type?: string, member?: IMemberContext) => {
		const queryParams: { type?: string; member?: string } = type
			? { type }
			: {};
		if (member) {
			queryParams['member'] = member.id;
		}
		// const state = member ? { member } : undefined;
		const team = this.team;
		if (team) {
			this.teamNav
				.navigateForwardToTeamPage(team, 'new-document', {
					state: { docType: type },
				})
				.catch(
					this.errorLogger.logErrorHandler(
						'Failed to navigate to new doc page',
					),
				);
		}
	};

	applyFilter(filter: string) {
		filter = filter && filter.toLowerCase();
		this.filter = filter;
		// this.contacts = !filter && !role
		//     ? this.allContacts
		//     : this.allContacts.filter(c =>
		//         (!filter || c.title.toLowerCase().includes(filter))
		//         && (!role || c.roles && c.roles.includes(role))
		//     );
	}
}
