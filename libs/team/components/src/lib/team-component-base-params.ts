import { ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
	APP_INFO,
	IAppInfo,
	ILoggerFactory,
	LOGGER_FACTORY,
	NgModulePreloaderService,
} from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ContactService,
	ContactusTeamService,
} from '@sneat/contactus-services';
import { TeamNavService, TeamService } from '@sneat/team-services';
import { SneatUserService } from '@sneat/auth-core';

@Injectable()
export class TeamComponentBaseParams {
	// TODO: verify it should be declared in providers attribute for each page or can be just on app level?
	constructor(
		// public readonly changeDetectorRef: ChangeDetectorRef,
		public readonly navController: NavController,
		public readonly userService: SneatUserService,
		public readonly teamService: TeamService,
		public readonly contactService: ContactService,
		public readonly contactusTeamService: ContactusTeamService,
		// public readonly contactusTeamService: ContactusTeamService,
		public readonly teamNavService: TeamNavService,
		public readonly preloader: NgModulePreloaderService,
		@Inject(ErrorLogger) public readonly errorLogger: IErrorLogger,
		@Inject(LOGGER_FACTORY) public readonly loggerFactory: ILoggerFactory,
		@Inject(APP_INFO) private readonly appService: IAppInfo,
	) {}
}
