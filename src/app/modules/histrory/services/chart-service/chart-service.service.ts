import { Injectable } from '@angular/core';
import { ExchangeRatesService } from 'src/app/services/exchange-rates/exchange-rates.service';
import { Observable } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { Currency } from 'src/app/modules/shared/models/currencies';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ConfigService } from 'src/app/services/config/config.service';


@Injectable({
  providedIn: 'any'
})
export class ChartServiceService {
  $data: Observable<any>;

  constructor(
    private exchangeRates: ExchangeRatesService,
    private config: ConfigService
  ) {
    this.$data = this.exchangeRates.$historical.pipe(
      map(data => {
        const dates = Object.keys(data.rates).sort((a, b) => {
          return moment(a, this.config.API_DATE_FORMAT).isBefore(moment(b, this.config.API_DATE_FORMAT)) ? -1 : 1;
        });
        const sets: {[key in Currency]?: {x: Moment, y: number}[]} = {};
        dates.forEach(date => {
          Object.keys(data.rates[date]).forEach(currency => {
            if (!sets[currency]) {
              sets[currency] = [];
            }
            sets[currency].push({
              x: moment(date, this.config.API_DATE_FORMAT),
              y: data.rates[date][currency]
            })
          })
        });
        return sets;
      }),
      map(sets => {
        return Object.keys(sets).map(label => {
          return {
            label,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: sets[label],
            fill: false
          }
        })
      }),
      shareReplay(1)
    )
  }
}
