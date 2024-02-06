import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { AssetCategory, IAssetBrief } from '@sneat/mod-assetus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { TeamNavService } from '@sneat/team-services';
import { AssetService } from '../services';

@Component({
	selector: 'sneat-assets-list',
	templateUrl: './assets-list.component.html',
})
export class AssetsListComponent implements OnChanges {
	assets?: IIdAndBrief<IAssetBrief>[];

	@Input() allAssets?: IIdAndBrief<IAssetBrief>[];
	@Input({ required: true }) team?: ITeamContext;
	@Input() assetType?: AssetCategory;
	@Input() filter = '';

	public deletingIDs: string[] = [];

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly assetService: AssetService,
		private readonly teamNavService: TeamNavService,
	) {}

	protected readonly id = (_: number, o: IIdAndBrief<IAssetBrief>) => o.id;

	ngOnChanges(changes: SimpleChanges): void {
		const { allAssets, assetType, filter } = this;
		if (!allAssets) {
			this.assets = undefined;
			return;
		}
		if (!allAssets.length) {
			this.assets = [];
			return;
		}
		const f = filter?.toLowerCase();
		if (!allAssets || (!filter && !assetType)) {
			this.assets = [...allAssets];
		} else {
			this.assets = allAssets?.filter(
				(asset) =>
					(!assetType || asset?.brief?.category === assetType) &&
					(!filter || asset?.brief?.title?.toLowerCase().includes(f) || -1),
			);
		}
		this.assets = this.assets?.sort((a, b) => {
			if (a.brief && b.brief && a.brief.title > b.brief?.title) return 1;
			if (a.brief && b.brief && a.brief.title < b.brief?.title) return -1;
			return 0;
		});
		console.log(
			'AssetsListComponent.ngOnChanges =>',
			changes,
			this.assetType,
			this.team,
			'allAssets:',
			this.allAssets,
			'filtered assets:',
			this.assets,
		);
	}

	public goAsset(asset: IIdAndBrief<IAssetBrief>): void {
		if (!asset) {
			return;
		}
		// let path: string;
		// switch (asset?.brief?.type) {
		// 	// case 'vehicle':
		// 	// 	path = 'vehicle';
		// 	// 	break;
		// 	// case 'real_estate':
		// 	// 	path = this.team?.type === 'realtor' ? 'real-estate' : 'property';
		// 	// 	break;
		// 	default:
		// 		path = 'asset';
		// 		break;
		// }
		if (!this.team) {
			this.errorLogger.logError(
				'can not navigate to asset page without team context',
			);
			return;
		}
		this.teamNavService
			.navigateForwardToTeamPage(this.team, `asset/${asset.id}`, {
				state: { asset },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to asset page'),
			);
	}

	delete(asset: IIdAndBrief<IAssetBrief>): void {
		const { id, brief } = asset;
		this.deletingIDs.push(id);
		const deleteCompleted = () =>
			(this.deletingIDs = this.deletingIDs.filter((v) => v !== id));
		setTimeout(() => {
			if (
				!confirm(
					`Are you sure you want to delete this asset?

       ID: ${id}
       Title: ${brief?.title}

       This operation can not be undone.`,
				)
			) {
				deleteCompleted();
				return;
			}
			this.assetService.deleteAsset(this.team?.id || '', asset.id).subscribe({
				next: () => {
					this.assets = this.assets?.filter((a) => a.id !== id);
				},
				error: this.errorLogger.logErrorHandler(
					'failed to delete an asset with ID=' + id,
				),
				complete: deleteCompleted,
			});
		}, 1);
	}
}
