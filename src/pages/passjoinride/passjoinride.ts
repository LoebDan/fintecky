import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HubdataProvider} from "../../providers/hubdata/hubdata";
import {BalanceProvider} from "../../providers/balance/balance";
import {DriversProvider} from "../../providers/drivers/drivers";
import {AuthProvider} from "../../providers/auth/auth";
import firebase from 'firebase';
import {NotificationsProvider} from "../../providers/notifications/notifications";
import {ProfileProvider} from "../../providers/profile/profile";


/**
 * Generated class for the PassjoinridePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passjoinride',
  templateUrl: 'passjoinride.html',
})
export class PassjoinridePage {
  public Balance: any;
  public UserId;
  DriverRideOb;
  RidesArray = [];
  Driver = [];
  public userProfile: firebase.database.Reference;
  public SchedRidesRef: firebase.database.Reference;
  DriverID;
  today = new Date();
  datetodayy;
  datetoday = this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public hubdataProvider: HubdataProvider,
              public BalanceProvider: BalanceProvider,
              public profileProvider: ProfileProvider,
              public DriversProvider: DriversProvider,
              public authProvider: AuthProvider,
              public NotificationsProvider: NotificationsProvider,
              public alertCtrl: AlertController,
  ) {
    this.SchedRidesRef = this.DriversProvider.fetchDriverSchedRides();
  }

  async ionViewDidEnter() {
    this.profileProvider.getUserProfile().once('value', async userProfileSnapshot => {
      this.Balance = userProfileSnapshot.val().Balance;
      this.UserId = userProfileSnapshot.val().DriverID;
      var today = new Date();
      this.datetoday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      this.datetodayy = this.today.toISOString();

      await this.SchedRidesRef.once('value', async RidesSnapshot => {
        this.RidesArray = [];
        this.DriverRideOb = RidesSnapshot.val();
        if(this.DriverRideOb != null || this.DriverRideOb != undefined){
          for(let x of Object.keys(this.DriverRideOb)){
            if(this.UserId != this.DriverRideOb[x].DriverID){
              var RideDate = this.DriverRideOb[x].DepartureDate;
              let basecost = Math.floor(Number(this.DriverRideOb[x].Distance)/1000 * 1.2);
              this.DriverRideOb[x].BaseCost = basecost;
              if(RideDate  >= this.datetodayy){
                if(this.Balance < basecost){
                  this.DriverRideOb[x].CanAfford = false;
                  this.RidesArray.push(this.DriverRideOb[x]);
                }
                else{
                  this.DriverRideOb[x].CanAfford = true;
                  this.RidesArray.push(this.DriverRideOb[x]);
                }
              }

            }
          }
        }


      })
    });
  }

  JoinRequest(RideOb){
    var partySize = 1;
    let alert = this.alertCtrl.create({
      title: 'Confirm Details',
      message: 'Start location: ' + RideOb.StartHub + "End location: " + RideOb.EndHub + "When: " + RideOb.SchedDate + " - " + RideOb.SchedTime,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('IT worked!');
            this.NotificationsProvider.PassSendRequest(RideOb, partySize);
            const alert = this.alertCtrl.create({
              title: 'Your ride has been scheduled!',
              message: 'You can now view the ride in the pending rides page and see if there are any partnered passengers.',
              buttons: ['Okay'],
            });
            alert.present();
            this.navCtrl.setRoot( 'PassengerviewpendingridesPage');
          }
        }
      ]
    });
    alert.present();
  }

  TopUp(topup){
    console.log("cancel");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PassjoinridePage');

  }

}
