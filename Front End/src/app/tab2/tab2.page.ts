import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { JkaneSvcService } from '../services/jkane-svc.service';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  msg:string = ''
  clerkCode: any | null = null;
  disabled:boolean = true
  public alertButtons = [
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
      this.validateClerkCode(data[0]);
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
   this.clerkAlert()
  }
  async clerkAlert() {
    const alert = await this.alertController.create({
      header: 'Please Enter Clerk Code',
      inputs: [
        {
          type: 'number',
          placeholder: 'Code',
          min: 1,
          max: 100,
        },
      ],
      buttons: this.alertButtons,
      cssClass: 'redeem-alert'
    });

    await alert.present();
    var alertInput = document.querySelector('ion-alert input');

    // Add a keyup event listener
    alertInput!.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter') {
        let inputValue = (event.target as HTMLInputElement).value;
        this.validateClerkCode(inputValue.trim());
        alert.dismiss();
      }
    });
  }
  sendMsg() {
    if(this.msg.trim() !== ''){
      this.jkaneSvc.sendText(this.msg, this.clerkCode).subscribe({
        next: (data: any) => {
          if(data.success){
            this.presentToast('Message Sent', 'top', 2500)
            this.msg = ''
          }
        },
        error:(error: HttpErrorResponse)=>{
          if(error.status === 400){

            this.presentToast('Message Failed - Forbidden word in message!', 'top', 2500)
          }else{
            this.presentToast('Message Failed - Try again', 'top', 2500)
          }
        }
      })
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
  validateClerkCode(code: any){
    this.jkaneSvc.validateClerkCode(code).subscribe({
      next: (data: any) => {
        if(data.success){
          this.disabled = false
          this.clerkCode = code
        }
      },
      error:()=>{
        this.clerkCode = null
        this.disabled = true
        this.presentToast('Invalid Clerk Code', 'top', 2500)
        this.router.navigateByUrl('/tabs/tab1')
      }
    })
  }
  logout(){
    this.msg = ''
    this.clerkCode = null
    this.router.navigateByUrl('/login')
  }

}
