import { Currency } from './currencies';

export interface ApiRates {
    rates: {
        [key in  Currency]?: number
    };
    base: Currency;
    date: string;
}

export interface ApiHistoricalRates {
    base: Currency;
    start_at: string;
    end_at: string;
    rates: {
        [key: string]: {
            [key in Currency]?: number
        }
    }
}