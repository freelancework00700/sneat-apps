import { Provider } from '@angular/core';
import { IListItemService, IListService, IListusService } from './interfaces';
import { ListItemService } from './list-item.service';
import { ListService } from './list.service';
import {
	IListusAppStateService,
	ListusAppStateService,
} from './listus-app-state.service';
import { ListusDbService } from './listus-db.service';

export const listusProviders: Provider[] = [
	{ provide: IListItemService, useClass: ListItemService },
	{ provide: IListService, useClass: ListService },
	{ provide: IListusAppStateService, useClass: ListusAppStateService },
	{ provide: IListusService, useClass: ListusDbService },
];
