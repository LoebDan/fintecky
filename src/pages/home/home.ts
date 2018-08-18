import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  show = true;

  isAboutShown;
  isBenefitsShown;
  isPassengerShown;
  isDriverShown;
  isHubsShown;
  isSafetyShown;
  currentUser: User;


  constructor(public navCtrl: NavController) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.show = false;
      }
    });

    this.isAboutShown = false;
    this.isBenefitsShown = false;
    this.isPassengerShown = false;
    this.isDriverShown = false;
    this.isHubsShown = false;
    this.isSafetyShown = false;

  }

  ionViewDidLoad() {
    console.log(' y you do dis');
  }

  toggleAbout(){
    this.isAboutShown = !this.isAboutShown;
  }

  toggleBenefits(){
    this.isBenefitsShown = !this.isBenefitsShown;
  }

  togglePassenger(){
    this.isPassengerShown = !this.isPassengerShown;
  }

  toggleDriver(){
    this.isDriverShown = !this.isDriverShown;
  }

  toggleHubs(){
    this.isHubsShown = !this.isHubsShown;
  }

  toggleSafety(){
    this.isSafetyShown = !this.isSafetyShown;
  }

  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  goToLogin(): void {
    this.navCtrl.push('LoginPage');
  }

  goToContactus(): void {
    this.navCtrl.push('ContactusPage');
  }



}
