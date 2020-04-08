import { Injectable } from '@angular/core';
import { ApiRates } from 'src/app/modules/shared/models/apiResponses';
import { Currency } from 'src/app/modules/shared/models/currencies';
import { ConfigService } from '../config/config.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class RatesCacheService {
  private cache: {[key: string]: ApiRates} = {};

  constructor(private config: ConfigService) {}

  private createKeyFRomRespose(apiResponse: ApiRates): string {
    return this.createKeyFromValues(apiResponse.base, apiResponse.date);
  }

  createKeyFromValues(base: Currency, date: string): string {
    return `${base}${date}`
  }

  add(data: ApiRates, desiredDate: string): void {
    const key = this.createKeyFRomRespose(data);
    const desiredKey = this.createKeyFromValues(data.base, desiredDate);
    const queryAge = moment.duration(
      moment(data.date, this.config.API_DATE_FORMAT).diff(
        moment(desiredDate, this.config.API_DATE_FORMAT), 'days', true
      ), 'days'
    ).as('days');
    const usedKey = (queryAge < 0) ? key : desiredKey;

    if (usedKey === key) {
      this.cache[usedKey] = data;
    }
  }

  getData(base: Currency, date: string): ApiRates {
    const key = this.createKeyFromValues(base, date);
    return this.cache[key];
  }
}
