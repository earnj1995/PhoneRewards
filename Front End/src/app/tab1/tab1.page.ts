import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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
  pointsToAdd: any
  

  public redeemPointsButtons = [
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
            Number(-this.selectedReward.value),
            data[0],
            this.currentCustomer.id
          )
          .subscribe((data: any) => {
            this.presentToast('Points Redemption Successful!', 'top', 2500);
            this.currentCustomer.balance = Number(
              this.currentCustomer.balance - this.selectedReward.value
            );
          });
      },
    },
  ];
  public addPointsButtons = [
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
        this.pointsToAdd = data[0]
        this.jkaneSvc
        .redeemPoints(
          Number(data[0]),
          this.clerkCode,
          this.currentCustomer.id
        )
        .subscribe((data: any) => {
          this.presentToast('Points Added Successfully!', 'top', 2500);
          this.currentCustomer.balance = Number(this.currentCustomer.balance) + Number(this.pointsToAdd)
        });
      },
    },
  ];
  public addPointsButtonsClerk = [
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
        this.clerkCode = data[0]
        this.addPoints();
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
    private jkaneSvc: JkaneSvcService,
    private toastrController: ToastController
  ) {
    this.currentCustomer = this.userSvc.getCurrentCustomer();
  }
 
  ionViewWillEnter(){
    this.currentCustomer = this.userSvc.getCurrentCustomer();
  }
ionViewDidEnter(){
  console.log(this.currentCustomer)
}
  selectReward(reward: any) {
    this.selectedReward = reward;
  }
  cancelRewardSelection() {
    this.selectedReward = null;
  }
  redeemRewardSelection() {
    if (this.currentCustomer.balance - this.selectedReward.value >= 0) {
      this.clerkAlertRedeem();
    }
  }
  async clerkAlertRedeem() {
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
      buttons: this.redeemPointsButtons,
    });

    await alert.present();
  }
  async clerkAlertAdd() {
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
      buttons: this.addPointsButtonsClerk,
    });

    await alert.present();
  }
  async addPoints(){
    const alert = await this.alertController.create({
      header: 'Add points',
      inputs: [
        {
          type: 'number',
          placeholder: 'Points',
          min: 1,
          max: 1000,
        },
      ],
      buttons: this.addPointsButtons,
    });

    await alert.present();
  }
  logout() {
    this.currentCustomer = null;
    this.router.navigateByUrl('/login');
  }
  async presentToast(msg: string, pos: 'top' | 'middle' | 'bottom', dur: number){
    const toast = await this.toastrController.create({
      message: msg,
      duration: dur,
      position: pos
    })
    await toast.present();
  }
}
