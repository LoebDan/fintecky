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
 * Generated class for the DriverPickUpPassengerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver-pick-up-passenger',
  templateUrl: 'driver-pick-up-passenger.html',
})
export class DriverPickUpPassengerPage {
  PassRideList = [];
  public rides = {};
  public Balance: any;
  public UserId;
  RideOb;
  RidesArray = [];
  Driver = [];
  public userProfile: firebase.database.Reference;
  public SchedRidesRef: firebase.database.Reference;
  DriverID;
  today = new Date();
  datetodayy;
  datetoday = this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate();
  currentUser: User;

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
    });
  }

  ionViewDidLoad(){
    this.SchedRidesRef.orderByChild('Status').equalTo('waiting').once("value", async snapshot => {
      this.RidesArray = [];
      this.RideOb = snapshot.val();
      var today = new Date();

      this.datetoday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      this.datetodayy = this.today.toISOString();
      if(this.RideOb != null){
        for(let x of Object.keys(this.RideOb)) {
          if (this.currentUser.uid != this.RideOb[x].DriverUID) {
            var RideDate = this.RideOb[x].RideDate;
            let basecost = Math.floor(Number(this.RideOb[x].Distance) / 1000 * 1.2);
            this.RideOb[x].BaseCost = basecost;

            if (RideDate >= this.datetodayy) {
              this.RidesArray.push(this.RideOb[x]);
            }
          }
        }
      }
    });
  }




  JoinRequest(RideOb){
    let myAlert = this.alertCtrl.create({
      title: 'You Are offering to be the driver!',
      subTitle: 'Confirm Details',
      enableBackdropDismiss: true ,
      message:'Start location: ' + RideOb.StartHub + " End location: " + RideOb.EndHub + " When: " + RideOb.DepartureDate + " - " + RideOb.DepartureTime + " <h4>Please specify the total number of Passengers you could take:</h4>" ,
      buttons:[
        {
          text: 'Cancel',
          handler: data => {
            console.log('IT worked!');

          },
          role: ''
        },
        {
          text: 'Confirm',
          handler: data => {
            this.RidesProvider.DriverJoined(RideOb, data.valueOf());
            const alert = this.alertCtrl.create({
              title: 'Your ride has been scheduled!',
              message: 'You can now view the ride in the pending rides page and see if there are any partnered passengers.',
              buttons: ['Okay'],
            });
            alert.present();
            this.navCtrl.setRoot( 'DriverfutureridesPage');
          },
          role: 'cancel'
        }
      ],
      inputs:[
        {
          type: 'radio',
          id: '1',
          name: '1',
          'label': '1',
          value: '1',
          'checked': true
        },
        {
          type: 'radio',
          id: '2',
          name: '2',
          'label': '2',
          value: '2',
          'checked': false
        },
        {
          type: 'radio',
          id: '3',
          name: '3',
          'label': '3',
          value: '3',
          'checked': false
        },
        {
          type: 'radio',
          id: '4',
          name: '4',
          'label': '4',
          value: '4',
          'checked': false
        },
        {
          type: 'radio',
          id: '5',
          name: '5',
          'label': '5',
          value: '5',
          'checked': false
        },
        {
          type: 'radio',
          id: '6',
          name: '6',
          'label': '6',
          value: '6',
          'checked': false
        },
      ]
    });
    myAlert.present();
  }

  TopUp(topup){
    console.log("cancel");
  }

}
