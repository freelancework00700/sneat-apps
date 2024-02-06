import { Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { IPersonNames } from '@sneat/auth-models';
import { AgeGroupID, Gender } from '@sneat/contactus-core';
import { excludeUndefined, TeamType } from '@sneat/core';
import { IUserDto } from '@sneat/dto';
import { Observable, share } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserRecordService {
	constructor(private readonly sneatApiService: SneatApiService) {}

	private initUserRecord$?: Observable<IUserDto>;

	public initUserRecord(request: IInitUserRecordRequest): Observable<IUserDto> {
		if (!request.ianaTimezone) {
			request = {
				...request,
				ianaTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			};
		}
		console.log(`initUserRecord()`, request);
		request = excludeUndefined(request);
		this.initUserRecord$ = this.sneatApiService
			.post<IUserDto>('users/init_user_record', request)
			.pipe(share());
		return this.initUserRecord$;
	}
}

export interface IInitUserRecordRequest {
	readonly authProvider?: string;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroupID;
	readonly names?: IPersonNames;
	readonly email?: string;
	readonly emailIsVerified?: boolean;
	readonly ianaTimezone?: string;
	readonly team?: { type: TeamType; title: string };
}
