import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const modules = [
  MatToolbarModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatInputModule,
  MatSlideToggleModule,
  MatCardModule,
  MatSelectModule,
  MatMenuModule,
  MatButtonModule,
  MatTableModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [],
  imports:[
    ...modules,
    MatMomentDateModule
  ],
  exports: modules
})
export class MaterialModule { }
