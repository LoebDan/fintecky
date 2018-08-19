import { Component } from "@angular/core";
import {
  // Alert,
  AlertController,
  Events,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from "ionic-angular";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

// import {FirsttopupPage} from "../firsttopup/firsttopup";
// import { HomePage } from "../home/home";
// import { DashboardPage } from "../dashboard/dashboard";


import { AuthProvider } from "../../providers/auth/auth";
// import { AgeValidator } from '../../validators/age';

import firebase from 'firebase';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  public detailsForm: FormGroup;
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public events: Events,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder,
  ) {
    this.detailsForm = formBuilder.group({

      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      ContactNo: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  async updateDetails(){
    const userId: string = await firebase.auth().currentUser.uid;
    const firstName: string = this.detailsForm.value.firstName;
    const lastName: string = this.detailsForm.value.lastName;
    const ContactNo: number = this.detailsForm.value.ContactNo;
    firebase
      .database()
      .ref(`/Clients/${userId}`)
      .update({
        name: firstName,
        surname: lastName,
        ContactNo: ContactNo,
        'HasFilledOutDetails': 'Yes',                        
      }).then(() =>{
        this.events.publish('user:details', true);
      });

    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.loading.dismiss().then(() => {
      this.navCtrl.setRoot( 'DashboardPage');
      // this.navCtrl.push('DashboardPage');
    });
  }

}

