import { AfterViewInit, Component, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-telegram-menu-page',
	templateUrl: './telegram-mini-app-home-page.component.html',
	standalone: true,
	imports: [IonicModule],
})
export class TelegramMiniAppHomePageComponent implements AfterViewInit {
	constructor(
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
		private sneatApiService: SneatApiService,
		private authService: SneatAuthStateService,
	) {}

	public ngAfterViewInit(): void {
		const telegramWebApp = (window as unknown as any).Telegram.WebApp;
		this.sneatApiService
			.postAsAnonymous<{
				token: string;
			}>('auth/signing-from-telegram-miniapp', telegramWebApp.initData)
			.subscribe({
				next: (response) => {
					// alert('Token: ' + response.token);
					this.authService
						.signInWithToken(response.token)
						.then(() => {
							telegramWebApp.ready();
							// alert('Signed in!');
						})
						.catch((err) => {
							telegramWebApp.ready();
							this.errorLogger.logError(
								err,
								'Failed to sign-in with custom token',
							);
						});
				},
				error: (err) => {
					telegramWebApp.ready();
					alert(
						'Failed to sign-in with telegram mini-app credentials: ' +
							JSON.stringify(err),
					);
				},
			});
	}
}
