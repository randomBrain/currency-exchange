import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { switchMap, filter, map, tap, share } from 'rxjs/operators'

import * as moment from 'moment';
import * as currencyJs from 'currency.js'
import { Currency } from 'src/app/modules/shared/models/currencies';
import { ApiRates, ApiHistoricalRates } from 'src/app/modules/shared/models/apiResponses';
import { RatesCacheService } from '../rates-cache/rates-cache.service';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {
  public $base: BehaviorSubject<Currency>;
  public $target: BehaviorSubject<Currency>;
  public $amount: BehaviorSubject<number> = new BehaviorSubject(0);
  public $converted: Observable<string>;

  public $loadingBase: Subject<boolean> = new Subject();

  public $$startDate: BehaviorSubject<string> = new BehaviorSubject(null);
  public $$endDate: BehaviorSubject<string> = new BehaviorSubject(moment().format(this.config.API_DATE_FORMAT))

  public $actualRates: Observable<ApiRates>;
  public $ratesList: Observable<ApiRates>; 
  public $historical: Observable<ApiHistoricalRates>; 
  
  constructor(
    private http: HttpClient,
    private cache: RatesCacheService,
    private config : ConfigService
  ) {
    this.$loadingBase.next(false);
    this.initCurrencies();
    this.initActualRates();
    this.initRatesList();
    this.initCoverted();
    this.initHistoricalRates();
  }

  public setBase(currency: Currency) {
    this.$base.next(currency);
  }

  public setAmmount(ammount: number): void {
    this.$amount.next(ammount);
  }

  public setTarget(currency: Currency): void {
    this.$target.next(currency);
  }

  public setStartDate(date: moment.Moment) {
    this.$$startDate.next(date.format(this.config.API_DATE_FORMAT))
  }

  public setEndDate(date: moment.Moment) {
    this.$$endDate.next(date.format(this.config.API_DATE_FORMAT))
  }

  private fetchRatesByDate(base: Currency, date: string ): Observable<ApiRates> {
    this.$loadingBase.next(true);
    return this.http.get(`${this.config.API_HOST}${date}`, {
      params: {
        base: base
      }
    }).pipe(
      tap((rates: ApiRates) => {
        this.$loadingBase.next(false);
        this.cache.add(rates, date);
      })
    ) as Observable<ApiRates>
  }

  private fetchLatestRates(base: Currency, currencies: Currency[] = []): Observable<ApiRates> {
    return this.http.get(`${this.config.API_HOST}latest`, {
      params: {
        base: base,
        symbols: currencies
      }
    }) as Observable<ApiRates>
  }

  private fetchHistoricalRates(base: Currency, target: Currency, start: string, end: string) {
    this.$loadingBase.next(true);
    return this.http.get(`${this.config.API_HOST}history`, {
      params: {
        base: base,
        symbols: target,
        start_at: start,
        end_at: end
      }
    }).pipe(
      tap(() => {
        this.$loadingBase.next(false);
      })
    ) as Observable<ApiHistoricalRates>
  }

  private initHistoricalRates() {
    this.$historical = combineLatest([
      this.$base,
      this.$target,
      this.$$startDate.pipe(filter(d => !!d)),
      this.$$endDate
    ]).pipe(
      switchMap(([base, target, start, end]) => this.fetchHistoricalRates(base, target, start, end)),
      share()
    )
  }

  private convert(amount: number, rate: number): string {
    return currencyJs(amount).multiply(rate).format(false);
  }

  private initCurrencies() {
    this.$base = new BehaviorSubject(Currency.EUR);
    this.$target = new BehaviorSubject(Currency.USD);
  }

  private initActualRates() {
    this.$actualRates = this.$base.pipe(
      tap((base) => {
        this.$loadingBase.next(true);
      }),
      switchMap((base) => this.fetchLatestRates(base)),
      tap((data) => {
        this.$loadingBase.next(false);
      }),
    )
  }

  private initRatesList() {
    this.$ratesList = combineLatest([
      this.$base,
      this.$$startDate.pipe(filter(d => !!d)),
    ]).pipe(
      switchMap(([base, date]) => {
        const cachedData = (this.cache.getData(base, date));
        return (cachedData)? of(cachedData) : this.fetchRatesByDate(base, date)
      }),
    )
  }

  initCoverted() {
    this.$converted = combineLatest(
      this.$base,
      this.$target,
      this.$actualRates,
      this.$amount
    ).pipe(
      filter(([base, target, actualRates]) => {
         return (base !== target && base === actualRates.base);
      }),
      map(([base, target, actualRates, ammount]) => {
        return this.convert(ammount, actualRates.rates[target])
      })
    )
  }
}
