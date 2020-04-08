import { Currency } from './currencies';

export interface ApiHistoryRates {
    rates: {
        [key in  Currency]?: number
    };
    base: Currency;
    date: string;
}