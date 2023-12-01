import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerSignup } from '../types/customerSignup';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JkaneSvcService {

  storeCode!: string
  storeCodeEnterDate!: Date
  constructor(private http : HttpClient) { }
  
  setStoreCode (code: string) {
    this.storeCodeEnterDate = new Date();
    this.storeCode = code;
  }
  getStoreCode = () => this.storeCode;
  getStoreCodeEnterDate = () => this.storeCodeEnterDate;
  signup = (newCustomer: CustomerSignup) =>  this.http.post(`${environment.apiBaseUrl}signup?storepin=${this.storeCode}`, newCustomer);
  getPoints = (phoneNum: String) => this.http.get(`${environment.apiBaseUrl}points?phone=${phoneNum}&storepin=123456`);
  redeemPoints = (points: any, clerkcode: string, customerid: number) => this.http.post(`${environment.apiBaseUrl}addpoints?clerkcode=${clerkcode}&storepin=${this.storeCode}`, {customerid, points}  )
  addPoints = (points: any, clerkcode: string, customerid: number) => this.http.post(`${environment.apiBaseUrl}addpoints?clerkcode=${clerkcode}&storepin=${this.storeCode}`, {customerid, points}  )
  sendText = (msg:string, clerkcode:string) =>this.http.post(`${environment.apiBaseUrl}sendmessage?clerkcode=${clerkcode}&storepin=${this.storeCode}`, {message: msg}  )
  validateClerkCode = (code: string) => this.http.get(`${environment.apiBaseUrl}clerkcode?storepin=123456&clerkcode=${code}`)
  validateStoreCode = (code: string) => this.http.get(`${environment.apiBaseUrl}pin?storepin=${code}`)
}
