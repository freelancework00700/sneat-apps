// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { Component, Inject, Optional } from '@angular/core';
import { Auth as AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
	AuthProviderName,
	AuthStatuses,
	ILoginEventsHandler,
	ISneatAuthState,
	LoginEventsHandler,
	SneatAuthStateService,
} from '@sneat/auth-core';
import { SneatUserService } from '@sneat/auth-core';
import {
	AnalyticsService,
	APP_INFO,
	IAnalyticsService,
	IAppInfo,
} from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Subject, takeUntil } from 'rxjs';
import { EmailFormSigningWith } from './email-login-form/email-login-form.component';
import { UserCredential } from 'firebase/auth';

type Action = 'join' | 'refuse'; // TODO: inject provider for action descriptions/messages.

@Component({
	selector: 'sneat-login',
	templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
	public signingWith?:
		| AuthProviderName
		| 'email'
		| 'emailLink'
		| 'resetPassword';
	public redirectTo?: string;
	public to?: string;
	public action?: Action; // TODO: document possible values?

	public appTitle = 'Sneat.app';

	constructor(
		@Inject(APP_INFO) private appInfo: IAppInfo,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Inject(LoginEventsHandler)
		@Optional()
		private readonly loginEventsHandler: ILoginEventsHandler,
		private readonly route: ActivatedRoute,
		private readonly afAuth: AngularFireAuth,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly authStateService: SneatAuthStateService,
		// private readonly toastController: ToastController,
	) {
		console.log('LoginPageComponent.constructor()');
		this.appTitle = appInfo.appTitle;
		if (location.hash.startsWith('#/')) {
			this.redirectTo = location.hash.substring(1);
		}
		this.to = this.route.snapshot.queryParams['to']; // should we subscribe? I believe no.
		const action = location.hash.match(/[#&]action=(\w+)/);
		this.action = action?.[1] as Action;
	}

	onEmailFormStatusChanged(signingWith?: EmailFormSigningWith): void {
		this.signingWith = signingWith;
	}

	loginWith(provider: AuthProviderName) {
		this.signingWith = provider;
		this.authStateService.signInWith(provider).subscribe({
			next: (userCredential) => this.onLoggedIn(userCredential),
			complete: () => {
				this.signingWith = undefined;
			},
			// error: undefined, No need to handle or log error as it will be logged in service
		});
	}

	public onLoggedIn(userCredential: UserCredential): void {
		console.log('LoginPage.onLoggedIn(userCredential):', userCredential);
		this.signingWith = undefined;
		if (!userCredential.user) {
			return;
		}
		const authState: ISneatAuthState = {
			status: AuthStatuses.authenticated,
			user: userCredential.user,
		};
		this.userService.onUserSignedIn(authState);
		// const { to } = this.route.snapshot.queryParams;
		// if (this.to) {
		// 	const queryParams = to ? { ...this.route.snapshot.queryParams } : undefined;
		// 	if (queryParams) {
		// 		delete queryParams['to'];
		// 	}
		// 	this.navController.navigateRoot(this.to, {
		// 		queryParams,
		// 		fragment: location.hash.substring(1),
		// 	}).catch(this.errorLogger.logErrorHandler('Failed to navigate to: ' + to));
		// } else {
		// 	this.loginEventsHandler?.onLoggedIn();
		// }
		const userRecordLoaded = new Subject<void>();
		this.userService.userState.pipe(takeUntil(userRecordLoaded)).subscribe({
			next: (userState) => {
				if (userState.record) {
					userRecordLoaded.next();
				} else {
					return;
				}
				console.log('this.redirectTo:', this.redirectTo);
				const redirectTo = this.redirectTo || '/'; // TODO: default one should be app specific.
				this.navController
					.navigateRoot(redirectTo)
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to navigate back to ' + redirectTo,
						),
					);
			},
			error: this.errorHandler('Failed to get user state after login'),
		});
		// this.userService.
		// this.authStateService.authState.subscribe({
		// 	next: authState => {
		// 	if (authState.user.)
		// 	},
		// 	error: this.errorHandler('Failed to get auth state after logged in'),
		// })
	}

	private errorHandler(
		m: string,
		eventName?: string,
		eventParams?: Record<string, string>,
	): (err: unknown) => void {
		return (err) => this.handleError(err, m, eventName, eventParams);
	}

	private handleError(
		err: unknown,
		m: string,
		eventName?: string,
		eventParams?: Record<string, string>,
	): void {
		if (eventName) {
			this.analyticsService.logEvent(eventName, eventParams);
		}
		this.errorLogger.logError(err, m, {
			report: !(err as { code: unknown }).code,
		});
		this.signingWith = undefined;
	}
}
