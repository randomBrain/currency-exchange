import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Currency } from '../../models/currencies';
import { MatSelectChange } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.sass']
})
export class CurrencySelectorComponent {
  currencies = Object.values(Currency);

  @Input() label:string = '';
  @Input() selected: Currency;
  @Input() disabled: boolean = false;

  @Output() selectionChanged: EventEmitter<Currency> = new EventEmitter();

  onCurrencyChange(e: MatSelectChange) {
    this.selectionChanged.emit(e.value);
  }
}
