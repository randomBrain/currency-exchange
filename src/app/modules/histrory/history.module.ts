import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartComponent } from './components/chart/chart.component';
import { ChartServiceService } from './services/chart-service/chart-service.service';


@NgModule({
  declarations: [HistoryComponent, ChartComponent],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    ChartServiceService
  ]
})
export class HistoryModule { }
