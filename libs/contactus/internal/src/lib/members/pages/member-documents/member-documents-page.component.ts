import { Component } from '@angular/core';
import { MemberBasePage } from '../member-base-page';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import {
	IAssetService,
	IMemberService,
} from 'sneat-shared/services/interfaces';
import { NgModulePreloaderService } from 'sneat-shared/services/ng-module-preloader.service';

@Component({
	selector: 'sneat-member-documents',
	templateUrl: './member-documents-page.component.html',
	providers: [CommuneBasePageParams],
	standalone: false,
})
export class MemberDocumentsPageComponent extends MemberBasePage {
	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		preloader: NgModulePreloaderService,
		assetService: IAssetService,
	) {
		super(params, membersService, preloader, assetService);
	}
}
