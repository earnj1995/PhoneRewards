import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentCustomer :any | null = null;
  constructor() { }
  setCurrentCustomer(customer: any) {
    this.currentCustomer = customer;
  }
  getCurrentCustomer() {
    return this.currentCustomer;
  }
}
