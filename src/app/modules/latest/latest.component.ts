import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Currency } from '../shared/models/currencies';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ExchangeRatesService } from 'src/app/services/exchange-rates/exchange-rates.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.sass']
})
export class LatestComponent implements OnInit, OnDestroy {
  $base: Observable<Currency>;
  currencies = Object.values(Currency);
  $rates: BehaviorSubject<{currency: Currency, rate: number}[]> = new BehaviorSubject([]);
  $destroy: Subject<boolean> = new Subject();
  displayedColumns = ['currency', 'rate'];
  $loading: Observable<boolean>;

  date =  new FormControl({
    value: moment(),
    disabled: false
  });

  maxDate = this.config.MAX_DATE;
  minDate =this.config.MIN_DATE;
  
  constructor(
    private exchangeRates: ExchangeRatesService,
    private config: ConfigService
  ) {
    this.$loading = this.exchangeRates.$loadingInProgress;
  }

  ngOnInit(): void {
    this.initActualRates();
    this.$base = this.exchangeRates.$base.asObservable();
    this.exchangeRates.setStartDate(moment());
    this.initDateChange();
  }

  onBaseChange(e: Currency) {
    this.exchangeRates.setBase(e);
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  private initActualRates() {
    this.exchangeRates.$ratesList.pipe(
      map(ratesData => 
        Object.keys(ratesData.rates)
          .filter(key => key !== ratesData.base)
          .map(key => ({currency: key, rate: ratesData.rates[key]}))),
      takeUntil(this.$destroy)
    ).subscribe((rates: {currency: Currency, rate: number}[]) => {
      this.$rates.next(rates)
    });
  }

  private initDateChange() {
    this.date.valueChanges.subscribe(date => {
     this.exchangeRates.setStartDate(date)
    })
  }
}
