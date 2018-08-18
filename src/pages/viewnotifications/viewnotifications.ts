import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationsProvider } from "../../providers/notifications/notifications";
import firebase from 'firebase';
import { User } from '@firebase/auth-types';


import { ProfileProvider} from "../../providers/profile/profile";
import {DriversProvider} from "../../providers/drivers/drivers";

/**
 * Generated class for the ViewnotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewnotifications',
  templateUrl: 'viewnotifications.html',
})
export class ViewnotificationsPage {
  Read = [];
  Unread = [];
  DriverpendingNot = [];
  NotOb;
  currentUser: User;
  public DriverScheduledRides: firebase.database.Reference;
  public userProfile: firebase.database.Reference;
  notref: firebase.database.Reference;
  // reqref: firebase.database.Reference;


  DriverRideOb;
  public UserId;
  public SchedRidesRef: firebase.database.Reference;
  DriverID;


  RidesArray = [];
  Driver = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public NotificationsProvider: NotificationsProvider,

    public profileProvider: ProfileProvider,
    public DriversProvider: DriversProvider,
  ) {
    // this.Notref = this.NotificationsProvider.GetNots();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.notref = firebase.database().ref(`/userProfile/${user.uid}/Notifications`);
      }
      else {
        this.delay(3000);
      }
    });


    this.SchedRidesRef = this.DriversProvider.fetchDriverSchedRides();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ViewnotificationsPage');
    // console.log(this.notref);

    await this.notref.on('value', async NotSnapshot => {
      this.NotOb = NotSnapshot.val();
      var ob = NotSnapshot.val();
      if (ob != null) {
        for (let x of Object.keys(ob)) {
          if (this.NotOb[x].Status == "Read") {
            this.Read.push(this.NotOb[x]);
          }
          if (this.NotOb[x].Status == "Unread") {
            this.Unread.push(this.NotOb[x]);
          }
        }
      }
    });
  }
 
}
