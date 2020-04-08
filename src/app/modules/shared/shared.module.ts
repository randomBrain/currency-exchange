import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CurrencySelectorComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    
  ],
  exports: [
    CurrencySelectorComponent
  ]
})
export class SharedModule { }
