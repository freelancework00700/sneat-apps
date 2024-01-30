import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { SneatApiService } from '@sneat/api';
import { StoreApiService } from '@sneat/datatug-services-repo';
import { CreateNamedRequest } from '@sneat/datatug-dto';
import { IEnvironmentSummary } from '@sneat/datatug-models';
import { createProjItem } from '@sneat/datatug-services-base';
import { startWith, tap } from 'rxjs/operators';
import { IProjectRef } from '@sneat/datatug-core';
import {
	ProjectContextService,
	ProjectService,
} from '@sneat/datatug-services-project';

const getEnvCacheKey = (projectRef: IProjectRef, env: string): string => {
	return `${projectRef.projectId}@${projectRef.storeId}/${env}`;
};

const envSummaryCache: Record<string, IEnvironmentSummary> = {};

@Injectable()
export class EnvironmentService {
	constructor(
		private readonly projectContextService: ProjectContextService,
		private readonly api: SneatApiService,
		private readonly projectService: ProjectService,
		private readonly storeApiService: StoreApiService, // private readonly http: HttpClient,
	) {}

	createEnvironment = (request: CreateNamedRequest): Observable<unknown> =>
		createProjItem<IEnvironmentSummary>(
			this.api,
			'datatug/environment/create_environment',
			request,
		);

	putConnection(): Observable<IEnvironmentSummary> {
		return throwError(() => '');
	}

	public getEnvSummary(
		projectRef: IProjectRef,
		env: string,
		forceReload = false,
	): Observable<IEnvironmentSummary> {
		if (!projectRef) {
			return throwError(() => '"projRef" is a required parameter');
		}
		if (!env) {
			return throwError(() => '"env" is a required parameter');
		}
		const cacheKey = getEnvCacheKey(projectRef, env);
		const cached = envSummaryCache[cacheKey];
		if (cached && !forceReload) {
			return of(cached);
		}
		const result = this.storeApiService
			.get<IEnvironmentSummary>(projectRef.storeId, '/environment-summary', {
				params: {
					proj: projectRef.projectId,
					env,
				},
			})
			.pipe(
				tap((envSummary) => {
					envSummaryCache[cacheKey] = envSummary;
				}),
			);
		return cached ? result.pipe(startWith(cached)) : result;
	}
}
