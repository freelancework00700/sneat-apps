import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInput, ToastController } from '@ionic/angular';
import { AnalyticsService, IAnalyticsService } from '@sneat/core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { IIdAndBrief } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { ICreateSpaceRequest, ISpaceContext } from '@sneat/team-models';
import { SpaceNavService, SpaceService } from '@sneat/team-services';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'sneat-spaces-card',
	templateUrl: './spaces-card.component.html',
})
export class SpacesCardComponent implements OnInit, OnDestroy {
	@ViewChild(IonInput, { static: false }) addSpaceInput?: IonInput; // TODO: IonInput;

	public spaces?: IIdAndBrief<IUserSpaceBrief>[];
	public loadingState: 'Authenticating' | 'Loading' = 'Authenticating';
	public spaceName = '';
	public adding = false;
	public showAdd = false; //
	private readonly destroyed = new Subject<void>();
	private subscriptions: Subscription[] = [];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navService: SpaceNavService,
		private readonly userService: SneatUserService,
		private readonly spaceService: SpaceService,
		private readonly contactService: ContactService,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		private readonly toastController: ToastController,
	) {}

	public ngOnDestroy(): void {
		console.log('TeamsCardComponent.ngOnDestroy()');
		this.destroyed.next();
		this.destroyed.complete();
		this.unsubscribe('ngOnDestroy');
	}

	public ngOnInit(): void {
		this.watchUserRecord();
	}

	public goSpace(space: ISpaceContext) {
		this.navService
			.navigateToSpace(space, 'forward')
			.catch(this.errorLogger.logError);
	}

	public addSpace() {
		this.analyticsService.logEvent('addSpace');
		const title = this.spaceName.trim();
		if (!title) {
			this.toastController
				.create({
					position: 'middle',
					message: 'Team name is required',
					color: 'tertiary',
					duration: 5000,
					keyboardClose: true,
					buttons: [{ role: 'cancel', text: 'OK' }],
				})
				.then((toast) =>
					toast
						.present()
						.catch((err) =>
							this.errorLogger.logError(err, 'Failed to present toast'),
						),
				)
				.catch((err) =>
					this.errorLogger.logError(err, 'Faile to create toast'),
				);
			return;
		}
		if (this.spaces?.find((t) => t.brief.title === title)) {
			this.toastController
				.create({
					message: 'You already have a team with the same name',
					color: 'danger',
					buttons: ['close'],
					position: 'middle',
					animated: true,
					duration: 3000,
				})
				.then((toast) => {
					toast
						.present()
						.catch((err) =>
							this.errorLogger.logError(err, 'Failed to present toast'),
						);
				})
				.catch((err) =>
					this.errorLogger.logError(err, 'Failed to create toast'),
				);
			return;
		}
		const request: ICreateSpaceRequest = {
			type: 'team',
			// memberType: TeamMemberType.creator,
			title,
		};
		this.adding = true;
		this.spaceService.createSpace(request).subscribe({
			next: (space) => {
				this.analyticsService.logEvent('spaceCreated', { space: space.id });
				const userTeamBrief2: IUserSpaceBrief = {
					userContactID: 'TODO: populate userContactID',
					title: space?.dbo?.title || space.id,
					roles: ['creator'],
					// memberType: request.memberType,
					type: space?.dbo?.type || 'unknown',
				};
				if (userTeamBrief2 && !this.spaces?.find((t) => t.id === space.id)) {
					this.spaces?.push({ id: space.id, brief: userTeamBrief2 });
				}
				this.adding = false;
				this.spaceName = '';
				this.goSpace(space);
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to create new team record');
				this.adding = false;
			},
		});
	}

	public startAddingSpace(): void {
		this.showAdd = true;
		setTimeout(() => {
			if (!this.addSpaceInput) {
				this.errorLogger.logError('addTeamInput is not set');
				return;
			}
			this.addSpaceInput
				.setFocus()
				.catch((err) =>
					this.errorLogger.logError(
						err,
						'Failed to set focus to "addTeamInput"',
					),
				);
		}, 200);
	}

	public leaveSpace(space: IIdAndBrief<IUserSpaceBrief>, event?: Event): void {
		if (event) {
			event.stopPropagation();
			event.preventDefault();
		}
		if (!confirm(`Are you sure you want to leave team ${space.brief.title}?`)) {
			return;
		}
		const userID = this.userService.currentUserID;
		if (!userID) {
			this.errorLogger.logError('Failed to get current user ID');
			return;
		}
		this.contactService
			.removeSpaceMember({ spaceID: space.id, contactID: userID })
			.subscribe({
				next: (response: unknown) => console.log('left space:', response),
				error: (err: unknown) =>
					this.errorLogger.logError(
						err,
						`Failed to leave a space: ${space.brief.title}`,
					),
			});
	}

	private watchUserRecord(): void {
		this.userService.userState.pipe(takeUntil(this.destroyed)).subscribe({
			next: (userState) => {
				console.log('TeamsCardComponent => user state changed:', userState);
				if (userState.status === 'authenticating') {
					if (this.loadingState === 'Authenticating') {
						this.loadingState = 'Loading';
					}
				}
				const uid = userState.user?.uid;
				this.spaces = undefined;
				if (!uid) {
					this.unsubscribe('user signed out');
					return;
				}
				this.subscriptions.push(
					this.userService.userState.subscribe({
						next: this.setUser,
						error: (err) =>
							this.errorLogger.logError(err, 'Failed to get user record'),
					}),
				);
			},
			error: (err) => this.errorLogger.logError(err, 'Failed to get user ID'),
		});
	}

	private unsubscribe(reason?: string): void {
		console.log(`TeamsCardComponent.unsubscribe(reason: ${reason})`);
		this.subscriptions.forEach((s) => s.unsubscribe());
		this.subscriptions = [];
	}

	private setUser = (userState: ISneatUserState): void => {
		console.log('TeamsCardComponent => user:', userState);
		const user = userState.record;
		if (user) {
			this.spaces = Object.entries(user?.spaces ? user.spaces : {}).map(
				([id, team]) => ({ id, brief: team }),
			);
			this.spaces.sort((a, b) => (a.brief.title > b.brief.title ? 1 : -1));
			this.showAdd = !this.spaces?.length;
			if (this.showAdd) {
				this.startAddingSpace();
			}
		} else {
			this.spaces = undefined;
		}
	};
}
