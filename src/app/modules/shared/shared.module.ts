import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageComponent } from './components/page/page.component';



@NgModule({
  declarations: [
    CurrencySelectorComponent,
    PageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    
  ],
  exports: [
    CurrencySelectorComponent,
    PageComponent
  ]
})
export class SharedModule { }
