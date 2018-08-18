import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ModalController, ViewController} from 'ionic-angular';
import {HubdataProvider} from "../../providers/hubdata/hubdata";
import {FormBuilder, FormGroup} from "@angular/forms";
// import {DriversProvider} from "../../providers/drivers/drivers";
import {PassengersProvider} from "../../providers/passengers/passengers";
import { MapsProvider } from './../../providers/maps/maps';
// import { MapservProvider } from './../../providers/mapserv/mapserv';
// import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';
import {JsmapsProvider} from "../../providers/jsmaps/jsmaps";
import {BalanceProvider} from "../../providers/balance/balance";


import {QuicktopupPage} from "../quicktopup/quicktopup";

declare var google: any;
/**
 * Generated class for the PartyschedridePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-partyschedride',
  templateUrl: 'partyschedride.html',
})
export class PartyschedridePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  location: {
    latitude: number,
    longitude: number
  };
  // locationn: {
  //   latitude: number,
  //   longitude: number
  // };

  public hubs = {};
  hublist = {};
  allhubsList = [];
  allhubs = [];
  public rideForm: FormGroup;
  startHub;
  endHub;
  travelinfo;
  public Balance: any;

  today = new Date();
  datetodayy;
  datetoday = this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate();


  constructor(
    public modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public hubdataProvider: HubdataProvider,
    public PassengersProvider: PassengersProvider,
    formBuilder: FormBuilder,
    public geolocation: Geolocation,
    public mapsProvider: MapsProvider,
    public JsmapsProvider: JsmapsProvider,
    public alertCtrl: AlertController,
    public BalanceProvider: BalanceProvider,
    public view: ViewController,

  ) {
    var today = new Date();
    this.datetoday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    this.datetodayy = this.today.toISOString();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(this.datetoday + " time " + time);




    this.rideForm = formBuilder.group({
      endHub: "",
      startHub: "",
      NoReqSeats: "",
      SchedTime: "",
      SchedDate: ""
    });
    console.log('ionViewDidLoad DriverridenowPage');
    this.hubdataProvider.getHubData().on('value', hubdataSnapshot => {
      this.hubs =  hubdataSnapshot.val();
      console.log(this.hubs + " Hubdata");
      for(let x of Object.keys(this.hubs)){
        var hublevel2 = this.hubs[x];
        console.log(hublevel2 + " temp");
        for(let y of Object.keys(hublevel2)){
          this.hublist[y] = this.hubs[x][y];
          var temp = y;
          this.allhubsList.push(temp);
          console.log(y + " y");
          this.allhubs.push(this.hublist[y]);
          console.log(this.hublist[y].Info + "info");
        }
      }
    });


  }

  closeModal(){
    this.view.dismiss();
  }


  BookRide(startHub, endHub){
    var SchedDate = this.rideForm.value.SchedDate;
    var SchedTime = this.rideForm.value.SchedTime;
    var startLoc = this.hublist[this.startHub].Address;
    var endloc = this.hublist[this.endHub].Address;
    var partySize = 1;
    // var basecost = "do this calculation then send it to the provider";
    var startArea = this.hublist[this.startHub].MainArea;
    var endArea = this.hublist[this.endHub].MainArea;
    var origin = this.hublist[this.startHub].Lat + "," + this.hublist[this.startHub].Long;
    var destination = this.hublist[this.endHub].Lat + "," +  this.hublist[this.endHub].Long;
    this.CalculateDis(startHub, endHub, origin, destination, startLoc, endloc, SchedDate, SchedTime, partySize, startArea, endArea);
  }

  CalculateDis(startHub, endHub, origin, destination, startLoc, endloc, SchedDate, SchedTime, partySize, startArea, endArea) {
    this.BalanceProvider.getViewBalance().on('value', async userBalanceSnapshot => {
        this.Balance = userBalanceSnapshot.val();
        let directionsService = new google.maps.DirectionsService;
        directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode['DRIVING']
        }, (res, status) => {

          if (status == google.maps.DirectionsStatus.OK) {
            this.travelinfo = res;
            var distance = this.travelinfo.routes["0"].legs["0"].distance.value;
            let basecost = (Math.floor(Number(distance) / 1000 * 1.2)) * partySize * ((21-partySize)/20);

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
              let alert = this.alertCtrl.create({
                title: 'Confirm Details',
                message: 'Start location: ' + startLoc + "/nEnd location: " + endloc + "/nWhen: " + SchedDate + " - " + SchedTime,
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
                      this.PassengersProvider.PassSchedRide(startHub, endHub, startLoc, endloc, SchedDate, SchedTime, distance, basecost, partySize, startArea, endArea);
                      const alert = this.alertCtrl.create({
                        title: 'Your ride has been scheduled!',
                        message: 'You can now view the ride in the pending rides page and see if any drivers are interested.',
                        buttons: ['Okay'],
                      });
                      alert.present();
                      //this.navCtrl.setRoot('PassviewschedridePage');
                    }
                  }
                ]
              });
              alert.present();
            }


          } else {
            console.warn(status);
          }

        });
      }
    );
  }
}
