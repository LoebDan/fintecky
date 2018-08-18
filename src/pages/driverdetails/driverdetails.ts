import { Component } from "@angular/core";
import {
  // Alert,
  AlertController,
  Events,
  IonicPage,
  // Loading,
  // LoadingController,
  NavController
} from "ionic-angular";

import { FormBuilder, FormGroup /*, Validators*/ } from "@angular/forms";
// import { DashboardPage } from "../dashboard/dashboard";
import { AuthProvider } from "../../providers/auth/auth";
import firebase from 'firebase';
/**
 * Generated class for the DriverdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driverdetails',
  templateUrl: 'driverdetails.html',
})
export class DriverdetailsPage {
  public DriverdetailsForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public events: Events,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder,
  ) {
    this.DriverdetailsForm = formBuilder.group({
      // DriverID: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // ContactNo: [''],
      DriverID: [''],
      LicensePlate: [''],
      carMake: [''],
      carModel: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  async updateDriverDetails(){
    const userId: string = await firebase.auth().currentUser.uid;
    const DriverID: string = this.DriverdetailsForm.value.DriverID;
    const LicensePlate: string = this.DriverdetailsForm.value.LicensePlate;
    const carMake: string = this.DriverdetailsForm.value.carMake;
    const carModel: string = this.DriverdetailsForm.value.carModel;
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .update({
        DriverID: DriverID,
        LicensePlate: LicensePlate,
        CarMake: carMake,
        CarModel: carModel,
        'RatingTotal': 5,
        'RatingCount': 1,
      }).then(() => {
      const alert = this.alertCtrl.create({
        title: 'Thank you, your details have been saved!',
        message: 'You can now access the driver options.',
        buttons: ['Okay'],
      });
      alert.present();
      this.events.publish('user:driver', true);
      this.navCtrl.setRoot( 'DashboardPage');
    });
  }

}

