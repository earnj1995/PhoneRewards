import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { JkaneSvcService } from '../services/jkane-svc.service';
import { CustomerSignup } from '../types/customerSignup';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber!: string;
  signingUp: boolean = false;
  newCustomer: CustomerSignup = new CustomerSignup();
  disabledLogin: boolean = true;
  today: Date = new Date();
  is21: boolean = false;
  enableTexting: boolean = false;
  public storeCodeAlertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',

      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: (data: any) => {
        this.enableLogin(data[0]);
      },
    },
  ];
  public storeCodeSendTextButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: (data: any) => {
        this.enableLogin(data[0]);
      },
    },
  ];
  constructor(
    private userSvc: UserService,
    private router: Router,
    private jkaneSvc: JkaneSvcService,
    private toastrCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.phoneNumber = '';
    console.log(this.jkaneSvc.getStoreCodeEnterDate());
    if (
      this.jkaneSvc.getStoreCode() === undefined ||
      this.is24HoursPassed(this.jkaneSvc.getStoreCodeEnterDate())
    ) {
      this.promptStoreCode();
    }
  }
  async sendTextPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Please Store Code',
      inputs: [
        {
          type: 'number',
          placeholder: 'Code',
          min: 1,
          max: 100,
        },
      ],
      buttons: this.storeCodeAlertButtons,
    });

    await alert.present();
    var alertInput = document.querySelector('ion-alert input');

    // Add a keyup event listener
    alertInput!.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter') {
        let inputValue = (event.target as HTMLInputElement).value;
        this.enableLogin(inputValue.trim());
        alert.dismiss();
      }
    });
  }

  is24HoursPassed(date: Date): boolean {
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const currentDate = new Date();
    const storedDate = new Date(date);
    return currentDate.getTime() - storedDate.getTime() > twentyFourHours;
  }
  login() {
    this.jkaneSvc.getPoints(this.phoneNumber).subscribe({
      next: (data: any) => {
        console.log(data);
        this.userSvc.setCurrentCustomer(data);
        this.router.navigateByUrl('tabs/tab1');
      },
      error: (response: HttpErrorResponse) => {
        if (response.error.message === 'Customer not found') {
          this.toastrCtrl
            .create({
              message: 'Customer not found, Please Sign Up',
              duration: 4000,
              position: 'top',
            })
            .then((toast) => {
              toast.present();
            });
          this.newCustomer.phone = this.phoneNumber;
          this.signingUp = true;
        }
      },
    });
  }
  signup() {
    this.signingUp = true;
  }
  completeSignup() {
    console.log(this.newCustomer);
    if (this.is21) {
      this.jkaneSvc.signup(this.newCustomer).subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.phoneNumber = this.newCustomer.phone;
          this.newCustomer.phone = '';
          this.newCustomer.name = '';
          this.signingUp = false;
          this.login();
        }
      });
    } else {
      this.toastrCtrl
        .create({
          message: 'Must be 21 or older',
          duration: 4000,
          position: 'top',
        })
        .then((toast) => {
          toast.present();
        });
    }
  }
  async promptStoreCode() {
    const alert = await this.alertCtrl.create({
      header: 'Please Store Code',
      inputs: [
        {
          type: 'number',
          placeholder: 'Code',
          min: 1,
          max: 100,
        },
      ],
      buttons: this.storeCodeAlertButtons,
    });

    await alert.present();
    var alertInput = document.querySelector('ion-alert input');

    // Add a keyup event listener
    alertInput!.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter') {
        let inputValue = (event.target as HTMLInputElement).value;
        this.enableLogin(inputValue.trim());
        alert.dismiss();
      }
    });
  }
  cancelSignup() {
    this.signingUp = false;
    this.phoneNumber = '';

    this.newCustomer.phone = '';
    this.newCustomer.name = '';
  }
  enableLogin(storecode: string) {
    this.jkaneSvc.validateStoreCode(storecode.trim()).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.jkaneSvc.setStoreCode(storecode);
          this.disabledLogin = false;
          this.enableTexting = true;
        }
      },
      error: () => {
        this.jkaneSvc.setStoreCode('');
        this.disabledLogin = true;
        this.toastrCtrl
          .create({
            message: 'Invalid Store Code',
            duration: 4000,
            position: 'top',
          })
          .then((toast) => {
            toast.present();
          });
      },
    });
  }
  redirectToSendText() {
    this.router.navigateByUrl('tabs/tab2');
  }
}
