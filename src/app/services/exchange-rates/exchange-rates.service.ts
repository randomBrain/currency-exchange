import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { switchMap, filter, map, tap } from 'rxjs/operators'

import * as moment from 'moment';
import * as currencyJs from 'currency.js'
import { Currency } from 'src/app/modules/shared/models/currencies';
import { ApiHistoryRates } from 'src/app/modules/shared/models/apiResponses';
import { RatesCacheService } from '../rates-cache/rates-cache.service';
import { ConfigService } from '../config/config.service';



@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {
  API_HOST = 'https://api.exchangeratesapi.io/';

  public $base: Subject<Currency> = new Subject();
  public $target: Subject<Currency> = new Subject();
  public $amount: BehaviorSubject<number> = new BehaviorSubject(0);
  public $converted: Observable<string>;

  public $loadingBase: Subject<boolean> = new Subject();

  public $$startDate: BehaviorSubject<string> = new BehaviorSubject(moment().format(this.config.API_DATE_FORMAT));
  public $$endDate: BehaviorSubject<string> = new BehaviorSubject(moment().format(this.config.API_DATE_FORMAT))

  public $actualRates: Observable<ApiHistoryRates>;
  public $historicalRates: Observable<ApiHistoryRates>; 
  
  constructor(
    private http: HttpClient,
    private cache: RatesCacheService,
    private config : ConfigService
  ) {
    this.initBase();
    this.initActualRates();
    this.initHistoricalRates();
    this.initCoverted();
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

  private fetchHistoricalRates(base: Currency, date: string ): Observable<ApiHistoryRates> {
    this.$loadingBase.next(true);
    return this.http.get(`${this.API_HOST}${date}`, {
      params: {
        base: base
      }
    }).pipe(
      tap((rates: ApiHistoryRates) => {
        this.$loadingBase.next(false);
        this.cache.add(rates, date);
      })
    ) as Observable<ApiHistoryRates>
  }

  private fetchLatestRates(base: Currency, currencies: Currency[] = []): Observable<ApiHistoryRates> {
    return this.http.get(`${this.API_HOST}latest`, {
      params: {
        base: base,
        symbols: currencies
      }
    }) as Observable<ApiHistoryRates>
  }

  private convert(amount: number, rate: number): string {
    return currencyJs(amount).multiply(rate).format(false);
  }

  private initBase() {
    this.$base = new BehaviorSubject(Currency.USD)
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

  private initHistoricalRates() {
    this.$historicalRates = combineLatest([
      this.$base,
      this.$$startDate,
    ]).pipe(
      switchMap(([base, date]) => {
        const cachedData = (this.cache.getData(base, date));
        console.log('cache', cachedData)
        return (cachedData)? of(cachedData) : this.fetchHistoricalRates(base, date)
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
