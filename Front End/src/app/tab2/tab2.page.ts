import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { JkaneSvcService } from '../services/jkane-svc.service';
import { UserService } from '../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  msg:string = ''
  clerkCode: any | null = null;
  public addPointsButtonsClerk = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.presentToast('Clerk code required', 'top', 2500)
       this.router.navigateByUrl('/tabs/tab1')
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: (data: any) => {
       if(data[0] === '1234'){
        this.clerkCode = data[0]
        return true;
       }else{
        this.presentToast('Invalid Clerk Code', 'top', 2500)
        this.router.navigateByUrl('/tabs/tab1')
        return false;
       }
      },
    },
  ];
  constructor( private alertController: AlertController,
    public userSvc: UserService,
    private jkaneSvc: JkaneSvcService,
    private toastrController: ToastController,
    private router: Router,
    private location: Location) {}

  ionViewWillEnter(){
   this.clerkAlertAdd()
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
  sendMsg() {
    if(this.msg.trim() !== ''){
      this.jkaneSvc.sendText(this.msg, this.clerkCode).subscribe()
    }else{
      this.presentToast('Message must not be blank', 'top',2500)
    }
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
