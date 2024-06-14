import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import {
	emptyHappeningSlot,
	IHappeningAdjustment,
	IHappeningSlot,
	ITiming,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { HappeningService } from '@sneat/team-services';
import { Subject, takeUntil } from 'rxjs';
import { StartEndDatetimeFormComponent } from '../start-end-datetime-form/start-end-datetime-form.component';

@Component({
	selector: 'sneat-single-slot-form',
	templateUrl: './single-slot-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IonicModule, StartEndDatetimeFormComponent],
})
export class SingleSlotFormComponent
	implements AfterViewInit, OnChanges, OnDestroy
{
	private readonly destroyed = new Subject<void>();

	@Input({ required: true }) team?: ITeamContext;
	@Input() happening?: IHappeningContext;
	@Input() happeningSlot: IHappeningSlot = emptyHappeningSlot;
	@Input() adjustment?: IHappeningAdjustment;

	@Input() dateID?: string; // For re-scheduling recurring event for a specific day

	@Input() isModal = false;

	@Output() readonly validChanged = new EventEmitter<boolean>();
	@Output() readonly happeningSlotChange = new EventEmitter<IHappeningSlot>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly happeningService: HappeningService,
	) {
		console.log('SingleSlotFormComponent.constructor()');
	}

	onTimingChanged(timing: ITiming): void {
		console.log('onTimingChanged', timing);
		if (timing == emptyHappeningSlot) {
			return;
		}
		if (!timing.end) {
			this.errorLogger.logError('timing has no end');
			return;
		}
		// if (!timing.durationMinutes) {
		// 	this.errorLogger.logError('timing has no durationMinutes');
		// 	return;
		// }
		this.happeningSlot = { ...this.happeningSlot, ...timing };
		this.emitHappeningSlotChange();
	}

	private emitHappeningSlotChange(): void {
		this.happeningSlotChange.emit(this.happeningSlot);
	}

	async close(event: Event): Promise<void> {
		event.stopPropagation();
		await this.modalController.dismiss();
	}

	async save(event: Event): Promise<void> {
		console.log('save()', event);
		event.stopPropagation();
		if (!this.team) {
			this.errorLogger.logError('team context is not set');
			return;
		}
		if (!this.happening) {
			this.errorLogger.logError('happening context is not set');
			return;
		}
		switch (this.happening.brief?.type) {
			case 'single':
		}
		if (this.happening?.brief?.type === 'single' || !this.dateID) {
			this.happeningService
				.updateSlot(this.team.id, this.happening.id, this.happeningSlot)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: () =>
						this.modalController
							.dismiss()
							.catch(this.errorLogger.logErrorHandler('failed to close modal')),
					error: this.errorLogger.logErrorHandler(
						'Failed to update happening slot',
					),
				});
		} else if (this.happening?.brief?.type === 'recurring' && this.dateID) {
			this.happeningService
				.adjustSlot(
					this.team.id,
					this.happening.id,
					this.happeningSlot,
					this.dateID,
				)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: () =>
						this.modalController
							.dismiss()
							.catch(this.errorLogger.logErrorHandler('failed to close modal')),
					error: this.errorLogger.logErrorHandler(
						'Failed to adjust happening slot',
					),
				});
		}
	}

	ngAfterViewInit(): void {
		console.log('ngAfterViewInit', this.happeningSlot);
		this.processHappening();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			this.processHappening();
		}
	}

	private processHappening(): void {
		// if (this.happening?.brief?.type === 'single') {
		// 	if (this.happening?.brief?.slots?.length === 1) {
		// 		this.singleSlot = this.happening.brief.slots[0];
		// 	}
		// }
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
