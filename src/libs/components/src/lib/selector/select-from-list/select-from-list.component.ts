import {
	Component, EventEmitter, forwardRef, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges,
	ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { NEVER, never, Observable, Subject, takeUntil } from 'rxjs';
import { ISelectItem } from '..';

@Component({
	selector: 'sneat-select-from-list',
	templateUrl: './select-from-list.component.html',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SelectFromListComponent),
		multi: true,
	}],
})
export class SelectFromListComponent implements ControlValueAccessor, OnChanges, OnDestroy {
	@Input() value = '';
	@Input() label = 'Please choose';
	@Input() isFilterable?: boolean;
	@Input() isLoading?: boolean;
	@Input() items?: ISelectItem[];
	@Input() items$: Observable<ISelectItem[]> = NEVER;
	@Input() radioSlot: 'start' | 'end' = 'start';
	@Input() other: 'top' | 'bottom' | 'none' = 'none';
	// @Input() ngModel?: string;
	// @Output() readonly ngModelChange = new EventEmitter<string>();

	private destroyed = new Subject<void>();

	@Output() changed = new EventEmitter<string>();

	@ViewChild(IonInput, { static: false }) addInput?: IonInput;

	displayItems?: ISelectItem[];
	hiddenCount = 0;

	public isDisabled = false;

	public filter = '';

	readonly id = (_: number, v: { id: string }) => v.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['items']) {
			this.applyFilter();
		}
		if (changes['items$'] && this.items$) {
			this.items$?.pipe(takeUntil(this.destroyed)).subscribe(items => {
				this.items = items;
				this.applyFilter();
			});
		}
	}

	private applyFilter(): void {
		const f = this.filter.trim().toLowerCase();
		console.log('applyFilter', f);
		this.displayItems = f ? this.items?.filter(v => v.title.toLowerCase().includes(f)) : this.items;
		this.hiddenCount = (this.items?.length || 0) - (this.displayItems?.length || 0);
	}

	onRadioChanged(event: Event): void {
		this.value = (event as CustomEvent).detail['value'] as string;
		this.onChange(this.value);
	}

	onSelectChanged(event: Event): void {
		console.log('onSelectChanged', event);
		// this.value = (event as CustomEvent).detail['value'] as string;
		this.onChange(this.value);
	}

	onChange = (_: any) => void 0;

	onTouched = () => void 0;

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	writeValue(obj: any): void {
		this.value = obj as string;
	}

	onFilterChanged(event: Event): void {
		this.applyFilter();
	}

	clearFilter(): void {
		this.filter = '';
	}

	ngOnDestroy(): void {
		this.destroyed.next();
	}
}
