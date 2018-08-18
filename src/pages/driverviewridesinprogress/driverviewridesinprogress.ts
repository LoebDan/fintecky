import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavController, NavParams
} from 'ionic-angular';
// import { DriversProvider } from "../../providers/drivers/drivers";
// import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';

import {PassengersProvider} from "../../providers/passengers/passengers";
import {BalanceProvider} from "../../providers/balance/balance";
import {ProfileProvider} from "../../providers/profile/profile";
import {RidesProvider} from "../../providers/rides/rides";
import {NotificationsProvider} from "../../providers/notifications/notifications";


/**
 * Generated class for the DriverviewridesinprogressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driverviewridesinprogress',
  templateUrl: 'driverviewridesinprogress.html',
})
export class DriverviewridesinprogressPage {
  public userId;
  currentUser: User;
  RideOb;
  RidesArray = [];
  public rides = {};
  public userProfile: firebase.database.Reference;
  public SchedRidesRef: firebase.database.Reference;

  Ride = {
    Status: 'Pending',
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public PassengersProvider: PassengersProvider,
    public BalanceProvider: BalanceProvider,
    public profileProvider: ProfileProvider,
    public NotificationsProvider: NotificationsProvider,
    public alertCtrl: AlertController,
    public RidesProvider: RidesProvider
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.SchedRidesRef = this.RidesProvider.fetchSchedRidess();
      }
      else {
        console.log("No logged in");
        this.delay(1000);
      }
    });
  }

  ionViewDidLoad() {
    this.SchedRidesRef.orderByChild('Status').equalTo('In Progress').on("value", async snapshot => {
      this.RidesArray = [];
      this.RideOb = await snapshot.val();
      if (this.RideOb != null && this.RideOb != undefined) {
        for (let x of Object.keys(this.RideOb)) {
          if (this.RideOb[x].DriverUID === this.currentUser.uid) {
            this.RideOb[x].RideUID = x;
            var members = this.RideOb[x].MemberFirstNames;
            var mems = members.split(',');
            var noMems = mems.length;
            var caltotal = Math.floor((noMems - 1) * (this.RideOb[x].Distance / 1000) * 1.2 * ((22 - noMems) / 20));
            this.RideOb[x].MemberNames = mems;
            this.RideOb[x].TotalReceived = caltotal;
            this.RidesArray.push(this.RideOb[x]);

          }
          else {
            console.log("Sees you arent the drivers of ride " + x);
          }
        }
      }
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  CompleteRide(Ride){
    this.RidesProvider.DriverEndRide(Ride);
    this.navCtrl.setRoot( 'DriverviewpastridesPage');
  }
}
