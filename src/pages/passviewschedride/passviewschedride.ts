import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavController
} from 'ionic-angular';
import {PassengersProvider} from "../../providers/passengers/passengers";
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';


/**
 * Generated class for the PassviewschedridePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passviewschedride',
  templateUrl: 'passviewschedride.html',
})
export class PassviewschedridePage {
  public userId;
  pastRideOb;
  RideArray = [];
  public userProfile: firebase.database.Reference;
  public PassengerRef: firebase.database.Reference;
  PassengerID;


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public PassengersProvider: PassengersProvider
  ) {
    this.userId = firebase.auth().currentUser.uid;
    this.userProfile = firebase.database().ref(`/userProfile/${this.userId}`);
    this.PassengerRef = firebase.database().ref(`/userProfile/${this.userId}/rides`);
    this.userProfile.on('value', async userProfileSnapshot => {
      this.PassengerID = await userProfileSnapshot.val().ID;
    });
  }


//this allows for the information retrieved from the database to be displayed
  async ionViewDidEnter() {
      await this.PassengerRef.once("value", async snapshot => {
        this.pastRideOb =  snapshot.val();
        if(this.pastRideOb != null && this.pastRideOb != undefined){
          for (let x of Object.keys(this.pastRideOb)) {
            this.RideArray.push(this.pastRideOb[x]);
          }
        }

  });
  }
}


