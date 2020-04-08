import { Component, OnInit } from '@angular/core';
import { ErrorService, Errormsg } from 'src/app/services/error/error.service';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.sass']
})
export class ErrorListComponent implements OnInit {

  constructor(public errors: ErrorService) { }

  ngOnInit(): void {

  }

  trackByFn(index: number, item: Errormsg) {
    return item.id;
  }

}
