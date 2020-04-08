import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public API_DATE_FORMAT = 'YYYY-MM-DD';
  ERROR_LIFESAPN = 10000;
  MIN_DATE: moment.Moment;
  MAX_DATE: moment.Moment;
  API_HOST = 'https://api.exchangeratesapi.io/';

  constructor() {
    this.MAX_DATE = moment(); //TODO: implement setTimeout on midnight to set new MAX-DATE
    this.MIN_DATE = moment('01.01.1999.', 'DD.MM.YYYY.');

  }
}
