import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
// import { ToastController } from 'ionic-angular';
// import {HubdataProvider} from "../../providers/hubdata/hubdata";
import {BalanceProvider} from "../../providers/balance/balance";
// import {AuthProvider} from "../../providers/auth/auth";
import firebase from 'firebase';
import {NotificationsProvider} from "../../providers/notifications/notifications";
import {ProfileProvider} from "../../providers/profile/profile";
import { PassengersProvider } from "../../providers/passengers/passengers";
import { User } from '@firebase/auth-types';
import {RidesProvider} from "../../providers/rides/rides";

/**
 * Generated class for the DriverfutureridesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driverfuturerides',
  templateUrl: 'driverfuturerides.html',
})
export class DriverfutureridesPage {
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
            console.log("Sees you arent the drivers of ride " + x);
          }
        }
      }
    });
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  StartRide(Ride){
    this.RidesProvider.DriverStartRide(Ride);
    this.navCtrl.setRoot( 'DriverviewridesinprogressPage');
  }

}
