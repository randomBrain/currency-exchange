import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/rates'
  },
  { path: 'rates', loadChildren: () => import('./modules/latest/latest.module').then(m => m.LatestModule) },
  { path: 'calculator', loadChildren: () => import('./modules/calculator/calculator.module').then(m => m.CalculatorModule) },
  { path: 'history', loadChildren: () => import('./modules/histrory/history.module').then(m => m.HistoryModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
