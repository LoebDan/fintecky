import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
// import { DriversProvider } from "../../providers/drivers/drivers";
// import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';

import {RidesProvider} from "../../providers/rides/rides";
import {PassengersProvider} from "../../providers/passengers/passengers";
import {BalanceProvider} from "../../providers/balance/balance";
import {ProfileProvider} from "../../providers/profile/profile";
import {NotificationsProvider} from "../../providers/notifications/notifications";
/**
 * Generated class for the PassengerviewpendingridesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passengerviewpendingrides',
  templateUrl: 'passengerviewpendingrides.html',
})
export class PassengerviewpendingridesPage {
  public userId;
  currentUser: User;
  RideOb;
  RidesArray = [];
  public rides = {};
  public userProfile: firebase.database.Reference;
  public SchedRidesRef: firebase.database.Reference;

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
      else{
        console.log("No logged in");
        this.delay(1000);
      }
    });
  }

  ionViewDidLoad() {
    this.SchedRidesRef.once("value", async snapshot => {
      this.RidesArray = [];
      this.RideOb = await snapshot.val();
      if(this.RideOb != null && this.RideOb != undefined){
        for(let x of Object.keys(this.RideOb)) {

          if(this.RideOb[x].Status == 'Pending' || this.RideOb[x].Status == 'Awaiting Driver'){

            firebase.database().ref(`/Rides/${x}`).once('value', snapshot => {

              var RID = snapshot.val();
              var members = RID.MemberFirstNames;
              var mems = members.split(',');
              var noMems = mems.length;
              var caltotal = Math.floor((noMems-1) * (RID.Distance/1000) * 1.2 * ((22-noMems)/20));
              var time = {
                title: RID.DepartureDate,
                subtitle: RID.DepartureTime
              };
              RID.time = time;
              RID.MemberNames = mems;
              RID.TotalReceived = caltotal;
              this.RidesArray.push(RID);
            });
          }
          else{
          }
        }
      }
    });
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
