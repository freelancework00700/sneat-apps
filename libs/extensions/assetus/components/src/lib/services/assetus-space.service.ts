import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IAssetBrief, IAssetusSpaceDbo } from '@sneat/mod-assetus-core';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceModuleService } from '@sneat/team-services';

@Injectable()
export class AssetusSpaceService extends SpaceModuleService<IAssetusSpaceDbo> {
	public constructor(afs: AngularFirestore) {
		super('assetus', afs);
	}

	readonly watchAssetBriefs = (space: ISpaceContext) =>
		this.watchBriefs<IAssetBrief>(space.id, (dto) => dto?.assets || {});
}
