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
    { text: '$5 Off', value: 200 },
    { text: '$10 Off', value: 400 },
    { text: '$15 Off', value: 600 },
    { text: '$20 Off', value: 800 },
  ];
  minValue = this.rewards.reduce((min, reward) => {
    return reward.value < min ? reward.value : min;
  }, this.rewards[0].value);

  selectedReward: any | null = null;

  currentCustomer?: any | null = null;

  clerkCode: any | null = null;
  pointsToAdd: any;

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
      handler: (_data: string) => {
        console.log(_data[0]);

        this.jkaneSvc.validateClerkCode(_data[0].trim()).subscribe({
          next: (data: any) => {
            if (data.success) {
              this.jkaneSvc
                .redeemPoints(
                  Number(-this.selectedReward.value),
                  _data[0],
                  this.userSvc.currentCustomer.id
                )
                .subscribe({
                  next: (data: any) => {
                    if (data.success) {
                      this.presentToast(
                        'Points Redemption Successful!',
                        'top',
                        2500
                      );

                      this.userSvc.setCustomerBalance(
                        Number(
                          this.userSvc.currentCustomer.balance -
                            this.selectedReward.value
                        )
                      );
                      this.selectedReward = null;
                    }
                  },
                  error: () => {
                    this.toastrController
                      .create({
                        message:
                          'Error: Points not redeemed, please try again.',
                        duration: 4000,
                        position: 'top',
                      })
                      .then((toast) => {
                        toast.present();
                      });
                  },
                });
            }
          },
          error: () => {
            this.clerkCode = null;
            this.toastrController
              .create({
                message: 'Invalid Clerk Code,',
                duration: 4000,
                position: 'top',
              })
              .then((toast) => {
                toast.present();
              });
          },
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
        this.addPointsValue(data[0]);
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
        this.addPointsClerkCode(data[0]);
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
  ) {}

  ionViewWillEnter() {}
  ionViewDidEnter() {
    if (
      this.userSvc.currentCustomer === null ||
      this.userSvc.currentCustomer === undefined
    ) {
      this.router.navigateByUrl('/login');
    }
    setTimeout(() => {
      this.logout();
      this.alertController.dismiss();
    }, 90000);
  }
  selectReward(reward: any) {
    this.selectedReward = reward;
  }
  cancelRewardSelection() {
    this.selectedReward = null;
  }
  redeemRewardSelection() {
    if (this.userSvc.currentCustomer.balance - this.selectedReward.value >= 0) {
      this.clerkAlertRedeem();
    }
  }
  async clerkAlertRedeem() {
    const alert = await this.alertController.create({
      header: 'Please Show Clerk, Enter Clerk Code',
      inputs: [
        {
          type: 'number',
          placeholder: 'Code',
          min: 1,
          max: 100,
          cssClass: 'redeem-alert',
        },
      ],
      buttons: this.redeemPointsButtons,
      cssClass: 'redeem-alert',
    });

    await alert.present();
  }
  async clerkAlertAdd() {
    const alert = await this.alertController.create({
      header: 'Please show clerk, Enter Clerk Code',
      inputs: [
        {
          type: 'number',
          placeholder: 'Code',
          min: 1,
          max: 100,
        },
      ],
      cssClass: 'redeem-alert',
      buttons: this.addPointsButtonsClerk,
    });

    await alert.present();
    var alertInput = document.querySelector('ion-alert input');

    // Add a keyup event listener
    alertInput!.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter') {
        let inputValue = (event.target as HTMLInputElement).value;
        this.addPointsClerkCode(inputValue.trim());
        alert.dismiss();
      }
    });
  }
  async addPoints() {
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
    var alertInput = document.querySelector('ion-alert input');

    // Add a keyup event listener
    alertInput!.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter') {
        let inputValue = (event.target as HTMLInputElement).value;
        this.addPointsValue(inputValue.trim());
        alert.dismiss();
      }
    });
  }
  logout() {
    this.userSvc.setCurrentCustomer(null);
    this.router.navigateByUrl('/login');
  }
  async presentToast(
    msg: string,
    pos: 'top' | 'middle' | 'bottom',
    dur: number
  ) {
    const toast = await this.toastrController.create({
      message: msg,
      duration: dur,
      position: pos,
    });
    await toast.present();
  }
  addPointsClerkCode(code: string) {
    this.jkaneSvc.validateClerkCode(code).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.clerkCode = code;
          this.addPoints();
        }
      },
      error: () => {
        this.clerkCode = null;
        this.toastrController
          .create({
            message: 'Invalid Clerk Code',
            duration: 4000,
            position: 'top',
          })
          .then((toast) => {
            toast.present();
          });
      },
    });
  }
  addPointsValue(value: any) {
    this.pointsToAdd = value;
    this.jkaneSvc
      .redeemPoints(
        Number(value),
        this.clerkCode,
        this.userSvc.currentCustomer.id
      )
      .subscribe((data: any) => {
        this.presentToast('Points Added Successfully!', 'top', 2500);
        this.userSvc.setCustomerBalance(
          Number(this.userSvc.currentCustomer.balance) +
            Number(this.pointsToAdd)
        );
      });
  }
}
