import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../config/config.service';

export interface Errormsg {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  lastId = 0;
  private errors: Errormsg[] = [];
  $errorList: BehaviorSubject<Errormsg[]> = new BehaviorSubject([]);

  constructor(private config: ConfigService) { }

  addError(errorMsg: string) {
    const id = this.getNewId();
    this.errors = [...this.errors, {id, message: errorMsg}];
    this.publish();
    setTimeout(() => {
      this.removeError(id);
    }, this.config.ERROR_LIFESAPN)
  }
  private getNewId() {
    this.lastId++;
    return this.lastId;
  }

  removeError(id: number) {
    this.errors = this.errors.filter(err => err.id !== id);
    this.publish();
  }

  private publish() {
    this.$errorList.next(this.errors);
  }
}
