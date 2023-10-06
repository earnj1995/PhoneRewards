import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';
import { JkaneSvcService } from '../services/jkane-svc.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  rewards = [
    { text: '10% Off', value: 100 },
    { text: '15% Off', value: 150 },
    { text: '20% Off', value: 200 },
    { text: '25% Off', value: 250 },
  ];

  selectedReward: any | null = null;

  currentCustomer: any | null = null;

  clerkCode: any | null = null;

  public alertButtons = [
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
        this.jkaneSvc
          .redeemPoints(
            Number(this.currentCustomer.balance - this.selectedReward.value),
            data[0],
            this.currentCustomer.id
          )
          .subscribe((data: any) => {
            console.log(data);
          });
      },
    },
  ];
  public alertInputs = [
    {
      placeholder: 'Name',
    },
    {
      placeholder: 'Nickname (max 8 characters)',
      attributes: {
        maxlength: 8,
      },
    },
    {
      type: 'number',
      placeholder: 'Age',
      min: 1,
      max: 100,
    },
    {
      type: 'textarea',
      placeholder: 'A little about yourself',
    },
  ];

  constructor(
    private alertController: AlertController,
    private router: Router,
    public userSvc: UserService,
    private jkaneSvc: JkaneSvcService
  ) {
    this.currentCustomer = this.userSvc.getCurrentCustomer();
  }
  ngInit() {
    console.log(this.currentCustomer);
  }

  selectReward(reward: any) {
    this.selectedReward = reward;
  }
  cancelRewardSelection() {
    this.selectedReward = null;
  }
  redeemRewardSelection() {
    if (this.currentCustomer.balance - this.selectedReward.value >= 0) {
      this.clerkAlert();
    }
  }
  async clerkAlert() {
    const alert = await this.alertController.create({
      header: 'Enter Clerk Code',
      inputs: [
        {
          type: 'number',
          placeholder: 'Code',
          min: 1,
          max: 100,
        },
      ],
      buttons: this.alertButtons,
    });

    await alert.present();
  }
  logout() {
    this.router.navigateByUrl('/login');
  }
}
