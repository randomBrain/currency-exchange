import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ExchangeRatesService } from 'src/app/services/exchange-rates/exchange-rates.service';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ConfigService } from 'src/app/services/config/config.service';
import { Currency } from '../shared/models/currencies';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit, OnDestroy {
  $loading: Observable<boolean>;

  startDate: FormControl;
  endDate: FormControl;

  $base: Observable<Currency>;
  $target: Observable<Currency>;

  maxDate = this.config.MAX_DATE;
  minDate =this.config.MIN_DATE;

  disabled= false;

  $destroy: Subject<boolean> = new Subject();

  constructor(
    private exchangeRates: ExchangeRatesService,
    private config: ConfigService,
    private ref: ChangeDetectorRef
  ) { 
    this.$base = this.exchangeRates.$base;
    this.$target = this.exchangeRates.$target.asObservable();
    this.exchangeRates.$loadingBase.pipe(
      takeUntil(this.$destroy)
    ).subscribe(val => {
      this.disabled =val;
      this.ref.detectChanges();
    });
  }
  
  ngOnInit(): void {
    this.initFormData();
    this.maxDate = this.config.MAX_DATE;
    this.minDate =this.config.MIN_DATE;
  }
  
  onBaseChange(e: Currency) {
    this.exchangeRates.setBase(e);
  }

  onTargetChange(e: Currency) {
    this.exchangeRates.setTarget(e);
  }

  initFormData() {
  this.startDate = new FormControl({
    value: moment().subtract(7, 'days'),
    disabled: false,
  });
    
    this.endDate = new FormControl({
      value: moment(),
      disabled: false
    });

    this.startDate.valueChanges.subscribe(date => this.exchangeRates.setStartDate(date));
    this.endDate.valueChanges.subscribe(date => this.exchangeRates.setEndDate(date));
    this.exchangeRates.setStartDate(moment().subtract(7, 'days'))
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
