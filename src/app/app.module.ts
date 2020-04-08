import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { RatesCacheService } from './services/rates-cache/rates-cache.service';
import { ExchangeRatesService } from './services/exchange-rates/exchange-rates.service';
import { ConfigService } from './services/config/config.service';
import { MenuComponent } from './components/menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    ExchangeRatesService,
    RatesCacheService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
