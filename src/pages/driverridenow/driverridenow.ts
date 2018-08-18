import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {HubdataProvider} from "../../providers/hubdata/hubdata";
import {FormBuilder, FormGroup} from "@angular/forms";
// import {DriversProvider} from "../../providers/drivers/drivers";
import {PassengersProvider} from "../../providers/passengers/passengers";
import { MapsProvider } from './../../providers/maps/maps';
// import { MapservProvider } from './../../providers/mapserv/mapserv';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
// import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';
// import {JsmapsProvider} from "../../providers/jsmaps/jsmaps";
import {BalanceProvider} from "../../providers/balance/balance";


// import {QuicktopupPage} from "../quicktopup/quicktopup";
import {ProfileProvider} from "../../providers/profile/profile";
import {RidesProvider} from "../../providers/rides/rides";

declare var google: any;

/**
 * Generated class for the DriverridenowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driverridenow',
  templateUrl: 'driverridenow.html',
})
export class DriverridenowPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  location: {
    latitude: number,
    longitude: number
  };

  public hubs = {};
  hublist = {};
  allhubsList = [];
  allhubs = [];
  public rideForm: FormGroup;
  startHub;
  endHub;
  today = new Date();
  datetodayy;
  datetoday = this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate();
  travelinfo;
  NoAvailSeats;
  public Balance: any;
  currentUser: User;

  public DriverID: string;
  public CarMake: string;
  public CarModel: string;
  public FirstName: string;
  public LicensePlate: string;
  public DriverContactNo: string;

  constructor(
    public modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public hubdataProvider: HubdataProvider,
    public PassengersProvider: PassengersProvider,
    formBuilder: FormBuilder,
    public geolocation: Geolocation,
    public mapsProvider: MapsProvider,
    public alertCtrl: AlertController,
    public BalanceProvider: BalanceProvider,
    public profileProvider: ProfileProvider,
    public RidesProvider: RidesProvider,

  ) {
    var today = new Date();
    this.datetoday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    this.datetodayy = this.today.toISOString();
    this.rideForm = formBuilder.group({
      endHub: "",
      startHub: "",
      NoAvailSeats: "",
      SchedTime: "",
      SchedDate: ""
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
      }
    });
    console.log('ionViewDidLoad DriverschedridePage');
    this.hubdataProvider.getHubData().on('value', hubdataSnapshot => {
      this.hubs =  hubdataSnapshot.val();
      for(let x of Object.keys(this.hubs)){
        var hublevel2 = this.hubs[x];
        for(let y of Object.keys(hublevel2)){
          this.hublist[y] = this.hubs[x][y];
          var temp = y;
          this.allhubsList.push(temp);
          this.allhubs.push(this.hublist[y]);
        }
      }
    });
    this.NoAvailSeats = 1;
  }

  Add(){
    this.NoAvailSeats += 1;
  }

  Less(){
    this.NoAvailSeats -= 1;
  }
  async ionViewDidLoad() {
    this.location = {
      latitude: -33.9321,
      longitude: 18.8601
    };
    await this.delay(3000).then(() => {
      this.testcall();
    });

  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async testcall(){
    await this.hubdataProvider.getHubData();
    this.mapsProvider.init(this.location, this.mapElement, this.hublist);
  }

  rideNow(startHub, endHub) {
    var today = new Date();
    today.setMinutes(today.getMinutes() + 130);
    var SchedDate = new Intl.DateTimeFormat().format();
    SchedDate = SchedDate.replace(/\//g, "-");
    var SchedTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var startLoc = this.hublist[this.startHub].Address;
    var endloc = this.hublist[this.endHub].Address;
    var partySize = 1;
    var startArea = this.hublist[this.startHub].MainArea;
    var endArea = this.hublist[this.endHub].MainArea;
    var origin = this.hublist[this.startHub].Lat + "," + this.hublist[this.startHub].Long;
    var destination = this.hublist[this.endHub].Lat + "," + this.hublist[this.endHub].Long;
    this.profileProvider.getUserProfile().once('value', async userProfileSnapshot => {
        this.Balance = userProfileSnapshot.val().Balance;
        var firstName = userProfileSnapshot.val().firstName;
        var members = this.currentUser.uid;
        var memFirstNames = firstName + ",";
        let directionsService = new google.maps.DirectionsService;
        directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode['DRIVING']
        }, (res, status) => {

          if (status == google.maps.DirectionsStatus.OK) {
            this.travelinfo = res;
            var distance = this.travelinfo.routes["0"].legs["0"].distance.value;
            let basecost = (Math.floor(Number(distance) / 1000 * 1.2)) * partySize * ((21 - partySize) / 20);
            var tempstring = '';
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
            for (var i = 0; i < 15; i++) {
              tempstring += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            this.DriverID = userProfileSnapshot.val().DriverID;
            this.CarModel = userProfileSnapshot.val().CarModel;
            this.FirstName = userProfileSnapshot.val().firstName;
            this.CarMake = userProfileSnapshot.val().CarMake;
            this.DriverContactNo = userProfileSnapshot.val().ContactNo;
            this.LicensePlate = userProfileSnapshot.val().CarModel;
            var DriverRideID = this.DriverID + "-" + tempstring;

            var driverUID = this.currentUser.uid;
            var rideObject = {
              RideID: tempstring,
              DriverUID: driverUID,
              DriverID: this.DriverID,
              CarMake: this.CarMake,
              CarModel: this.CarModel,
              Members: members,
              MemberFirstNames: memFirstNames,
              DriverFirstName: this.FirstName,
              DriverContactNo: this.DriverContactNo,
              LicensePlate: this.LicensePlate,
              DriverStartLocation: startLoc,
              DriverEndLocation: endloc,
              DepartureTime: SchedTime,
              AvailSeats: this.NoAvailSeats,
              DepartureDate: SchedDate,
              Distance: distance,
              StartArea: startArea,
              EndArea: endArea,
              StartHub: startHub,
              EndHub: endHub,
              Status: 'Pending',
              TotalReceived: "Waiting for a driver",
              RideDate: today.toDateString(),
              BaseCost: basecost
            };

            let aalert = this.alertCtrl.create({
              title: 'Confirm Details',
              message: 'Start location: ' + startLoc +  " End location: " + endloc + " When: " + SchedDate + " - " + SchedTime,
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
                    this.RidesProvider.DriverSchedRidee(rideObject);
                    const alertt = this.alertCtrl.create({
                      title: 'Your ride has been scheduled!',
                      message: "You can now view the ride in the Your Rides Awaiting Passenger Requests Page and see if any passengers are interested.",
                      buttons: ['Okay'],
                    });
                    alertt.present();
                    this.navCtrl.setRoot('DriverfutureridesPage');
                  }
                }
              ]
            });
            aalert.present();
            // }
          } else {
            console.warn(status);
          }
        });
      }
    );
  };
}
