import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {HubdataProvider} from "../../providers/hubdata/hubdata";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PassengersProvider} from "../../providers/passengers/passengers";
import { MapsProvider } from './../../providers/maps/maps';
import { Geolocation } from '@ionic-native/geolocation';
import {BalanceProvider} from "../../providers/balance/balance";
import {QuicktopupPage} from "../quicktopup/quicktopup";
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import {ProfileProvider} from "../../providers/profile/profile";
import {RidesProvider} from "../../providers/rides/rides";


declare var google: any;
/**
 * Generated class for the PassridenowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passridenow',
  templateUrl: 'passridenow.html',
})
export class PassridenowPage {
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
  travelinfo;
  public Balance: any;
  currentUser: User;

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
    public RidesProvider: RidesProvider
  ) {
    this.rideForm = formBuilder.group({
      endHub: "",
      startHub: "",
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
      }
    });
    console.log('ionViewDidLoad DriverridenowPage');
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
  }

  async ionViewDidLoad() {
    this.location = {
      latitude: -33.9321,
      longitude: 18.8601
    };
    console.log("Map here");
    await this.delay(3000).then(() => {
      this.testcall();
    });

  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async testcall(){


    await this.hubdataProvider.getHubData();
    await this.mapsProvider.init(this.location, this.mapElement, this.hublist);
  }

  PassrideNow(startHub, endHub){
    var SchedDate = new Intl.DateTimeFormat().format();
    SchedDate = SchedDate.replace(/\//g, "-");
    var today = new Date();
    today.setMinutes(today.getMinutes() + 130);

    var SchedTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var startLoc = this.hublist[this.startHub].Address;
    var endloc = this.hublist[this.endHub].Address;
    var startArea = this.hublist[this.startHub].MainArea;
    var endArea = this.hublist[this.endHub].MainArea;
    var origin = this.hublist[this.startHub].Lat + "," + this.hublist[this.startHub].Long;
    var destination = this.hublist[this.endHub].Lat + "," +  this.hublist[this.endHub].Long;
    this.profileProvider.getUserProfile().once('value', async userProfileSnapshot => {
      this.Balance = userProfileSnapshot.val().Balance;
      var firstName = userProfileSnapshot.val().firstName;
      var members = "Waiting for a driver," + this.currentUser.uid;
      var memFirstNames = "Waiting for a driver," + firstName;
        let directionsService = new google.maps.DirectionsService;
        directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode['DRIVING']
        }, (res, status) => {

          if (status == google.maps.DirectionsStatus.OK) {
            this.travelinfo = res;
            var distance = this.travelinfo.routes["0"].legs["0"].distance.value;
            let basecost = (Math.floor(Number(distance) / 1000 * 1.2));

            //can only proceed if they have enough credits available
            if(this.Balance < basecost){
              const alert = this.alertCtrl.create({
                title: 'Your Balance is too low! Would you like to top up immediately and then proceed with your ride scheduling?',
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
                      console.log('Confirmed clicked');
                      let myModal = this.modal.create(QuicktopupPage);
                      myModal.present();
                    }
                  }
                ]
              });
              alert.present();
            }
            else{
              var tempstring = '';
              var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
              for (var i = 0; i < 15; i++) {
                tempstring += possible.charAt(Math.floor(Math.random() * possible.length));
              }
              var rideObject = {
                RideID: tempstring,
                DriverUID: "Awaiting",
                DriverID : "Awaiting",
                CarMake : "Awaiting",
                CarModel: "Awaiting",
                Members: members,
                MemberFirstNames: memFirstNames,
                DriverFirstName : "Waiting for a driver",
                DriverContactNo: "Waiting for a driver",
                LicensePlate: "Waiting for a driver",
                DriverStartLocation: startLoc,
                DriverEndLocation: endloc,
                DepartureTime: SchedTime,
                AvailSeats: '1',
                DepartureDate: SchedDate,
                Distance: distance,
                StartArea: startArea,
                EndArea: endArea,
                StartHub: startHub,
                EndHub: endHub,
                Status: 'waiting',
                TotalReceived: "Waiting for a driver",
                RideDate: today.toDateString(),
                BaseCost: basecost
              };

              let aalert = this.alertCtrl.create({
                title: 'Confirm Details',
                message: '<h3>Start location: ' + startLoc + "<br>End location: " + endloc + "<br>When: " + SchedDate + " - " + SchedTime + "</h3>",
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
                      this.RidesProvider.SchedRidee(rideObject);
                      const alertt = this.alertCtrl.create({
                        title: 'Your ride has been scheduled!',
                        message: 'You can now view the ride in the pending rides page and see if any drivers are interested.',
                        buttons: ['Okay'],
                      });
                      alertt.present();
                      this.navCtrl.setRoot('PassengerviewpendingridesPage');
                    }
                  }
                ]
              });
              aalert.present();
            }
          } else {
            console.warn(status);
          }
        });
      }
    );
  }
}
