import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { JkaneSvcService } from '../services/jkane-svc.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  PhoneNumber!: string;
  signingUp: boolean = false;
  newCustomer: any = {};
  constructor(private userSvc:UserService,private router: Router, private jkaneSvc : JkaneSvcService) { }

  ngOnInit() {
  }
  login(){

      this.jkaneSvc.getPoints(this.PhoneNumber).subscribe((data: any) => {
        console.log(data)
        this.userSvc.setCurrentCustomer(data);
        this.router.navigateByUrl('tabs/tab1');
      });
  }
  signup(){
    this.signingUp = true;
  }
}
