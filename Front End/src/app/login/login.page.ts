import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { JkaneSvcService } from '../services/jkane-svc.service';
import { CustomerSignup } from '../types/customerSignup';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber!: string;
  signingUp: boolean = false;
  newCustomer: CustomerSignup = new CustomerSignup();
  constructor(
    private userSvc: UserService,
    private router: Router,
    private jkaneSvc: JkaneSvcService
  ) {}

  ngOnInit() {}
  login() {
    this.jkaneSvc.getPoints(this.phoneNumber).subscribe((data: any) => {
      console.log(data);
      this.userSvc.setCurrentCustomer(data);
      this.router.navigateByUrl('tabs/tab1');
    });
  }
  signup() {
    this.signingUp = true;
  }
  completeSignup() {
    console.log(this.newCustomer);
    this.jkaneSvc.signup(this.newCustomer).subscribe((data: any) => {
      console.log(data);
      // this.router.navigateByUrl('tabs/tab1');
      
    });
  }
}
