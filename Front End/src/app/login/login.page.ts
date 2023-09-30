import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  PhoneNumber!: string;
  Customers = [
   {
    name: 'John Doe',
    points: 100,
    phoneNumber: '222-222-2222',
  },
  {
    name: 'Jane Doe',
    points: 1500,
    phoneNumber: '111-111-1111',
  }
];
  constructor(private userSvc:UserService,private router: Router) { }

  ngOnInit() {
  }
  login(){
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (phoneRegex.test(this.PhoneNumber)) {
      const matchingCustomer = this.Customers.find(customer => customer.phoneNumber === this.PhoneNumber);
      if (matchingCustomer) {
        this.userSvc.setCurrentCustomer(matchingCustomer);
        console.log('Customer found');
        console.log(matchingCustomer);
        this.PhoneNumber = '';
        this.router.navigateByUrl('tabs/tab1');
      }
    } else {
      alert('Please enter a valid phone number (e.g. 123-456-7890)');
    }
  }
}
