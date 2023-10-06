import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JkaneSvcService {

  constructor(private http : HttpClient) { }

  //signup
  signup(newCustomer: any) {
    return this.http.post('https://jkanesvapeapi.com/v1/api/signup?storepin=123456', newCustomer);
  }
  //points
  getPoints(phoneNum: String) {
    return this.http.get(`https://jkanesvapeapi.com/v1/api/points?phone=${phoneNum}&storepin=123456`);
  }
}
