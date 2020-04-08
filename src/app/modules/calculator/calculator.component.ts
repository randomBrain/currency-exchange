import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { Currency } from '../shared/models/currencies';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, shareReplay } from 'rxjs/operators';
import { ExchangeRatesService } from 'src/app/services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.sass']
})
export class CalculatorComponent implements OnInit, OnDestroy {
  $base: Observable<Currency>;
  $target: Observable<Currency>;
  ammount = new FormControl(0);
  converted: BehaviorSubject<string> = new BehaviorSubject('0');

  $destroy: Subject<boolean> = new Subject();

  constructor(private exchangeRates: ExchangeRatesService) { }

  ngOnInit(): void {
    this.$base = this.exchangeRates.$base.pipe(shareReplay(1));
    this.$target = this.exchangeRates.$target.pipe(shareReplay(1));
    this.exchangeRates.$converted.pipe(
      takeUntil(this.$destroy)
    ).
    subscribe(con => this.converted.next(con));

    this.ammount.valueChanges.pipe(
      takeUntil(this.$destroy)
    ).subscribe((value) => {
      this.exchangeRates.setAmmount(value);
    })
  }

  onBaseChange(e: Currency) {
    this.exchangeRates.setBase(e);
  }

  onTargetChange(e: Currency) {
    this.exchangeRates.setTarget(e);
  }

  onAmmountChange(e: any){
     this.exchangeRates.setAmmount(e.target.valueAsNumber )
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
