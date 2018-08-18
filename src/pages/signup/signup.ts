import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';

import firebase from 'firebase';
// import { DetailsPage } from "../details/details";
// Declare any page you use
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder
  ) {
    this.signupForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }

  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(
        `Need to complete the form, current value: ${this.signupForm.value}`
      );
    } else {
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;
      this.authProvider.signupUser(email, password).then(
        async user => {
          SignupPage.checkDetails().then(value => {
            if(value == 'No'){
              this.loading.dismiss().then(() => {
                this.navCtrl.setRoot('DetailsPage');
                this.navCtrl.push("DetailsPage");
              });
            }
            else{
              this.loading.dismiss().then(() => {
                this.navCtrl.setRoot('DashboardPage');
              });
            }
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
  static async checkDetails(){
    const userId: string = firebase.auth().currentUser.uid;
    let hasDeetss = await firebase.database().ref(`/userProfile/${userId}/HasFilledOutDetails`).once("value");
    return hasDeetss.val();
  }
}


