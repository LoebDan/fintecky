import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TopupPage } from "../topup/topup";
import { RidesProvider} from "../../providers/rides/rides";
import firebase from 'firebase';
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  public hubs = {};
  hublist = {};
  allhubsList = [];
  allhubs = [];
  Read = [];
  Unread = [];
  NotOb;


  RideOb = {};
  RidesArray = [];
  location: {
    latitude: number,
    longitude: number
  };
  locationn: {
    latitude: number,
    longitude: number
  };
  public Balance: any;
  public userProfile: firebase.database.Reference;
  currentUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public RidesProvider: RidesProvider,
    public authProvider: AuthProvider,

  )
  {
    // const userId: string =  firebase.auth().currentUser.uid;
    // console.log(userId + " amazing");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid);
        console.log(user + " user");

        this.currentUser = user.uid;
      }
      else {
        this.authProvider.logoutUser().then(() => {
          this.navCtrl.setRoot('LoginPage');
        });
      }
    });
  }

  async ionViewDidLoad(){
    this.location = {
      latitude: -33.9321,
      longitude: 18.8601
    };
    await this.delay(3000).then(() => {
      this.testcall();
    });
    this.RidesProvider.fetchrides().on('value', async userProfileSnapshot => {
      this.RideOb = await userProfileSnapshot.val();
      //Here you get an object back that contains every transaction of the user
      for(let key of Object.keys(this.RideOb)){
        //  Then you say for every key within the object run these lines (so run for each transaction ID)
        this.RidesArray.push(this.RideOb[key]);
      }
    });

  }

  getNots(){
    firebase.database().ref(`/userProfile/${this.currentUser}/Notifications`).on('value', async NotSnapshot => {
      this.Read = [];
      this.Unread = [];
      console.log(this.currentUser + " not");
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

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async testcall(){

  }

//this allows for the information retrieved from the database to be displayed
  async ionViewDidEnter() {
    await this.delay(1000);
    firebase.database().ref(`/userProfile/${this.currentUser}/Balance`).on('value', userBalanceSnapshot => {
      this.Balance = userBalanceSnapshot.val();
    });
    this.getNots();
  }

//Top up credits button taking user to top up page
  topUp(){
    this.navCtrl.push(TopupPage);
  }

  ReadM(NotOb){
    console.log(NotOb.NoticeID);
    try{
      firebase.database().ref(`/userProfile/${this.currentUser}/Notifications/${NotOb.NoticeID}`).update({Status: "Read"});
    }
    catch (e) {
      console.log(e)
    }
  }
}
