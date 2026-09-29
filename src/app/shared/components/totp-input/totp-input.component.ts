import { Component, forwardRef, ChangeDetectionStrategy, ViewChild,ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Renderer2 } from '@angular/core';

@Component({
    selector: 'app-totp-input',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './totp-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TotpInputComponent),
        multi: true
    }]
})
export class TotpInputComponent implements ControlValueAccessor {
    @ViewChild('input') private inputRef!: ElementRef<HTMLInputElement>;
    private renderer = inject(Renderer2);

    value = '';
    isDisabled = false;

    private onChange = (v: string) => {};
    private onTouched = () => {};


    focus(): void {
        this.inputRef.nativeElement.focus();
    }

    onInput(val: string): void {
        const clean = val.replace(/\D/g, '').slice(0,6);
        this.value = clean;
        this.onChange(clean);
    }

    onBlur(): void {
        this.onTouched();
    }

    writeValue(value: string): void { this.value = value ?? ''}
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn }
    setDisabledState(disabled: boolean): void { this.isDisabled = disabled }
}