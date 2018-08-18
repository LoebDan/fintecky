import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { JsmapsProvider } from '../jsmaps/jsmaps';
import { NativemapsProvider } from '../nativemaps/nativemaps';
import { GoogleMaps } from '@ionic-native/google-maps';
import {HubdataProvider} from "../hubdata/hubdata";
import {FormGroup} from "@angular/forms";
// declare var google: any;

/*
  Generated class for the MapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsProvider {
  location: {
    lat: number,
    lng: number
  };
  locationn: {
    lat: number,
    lng: number
  };

  public hubs = {};
  hublist = {};
  allhubsList = [];
  allhubs = [];
  public rideForm: FormGroup;
  startHub;
  endHub;
  travelinfo;

  map: any;

  constructor(public platform: Platform,
              public hubdataProvider: HubdataProvider,

  ) {
    if(this.platform.is('cordova') &&
      (this.platform.is('ios') || this.platform.is('android'))){
      this.map = new NativemapsProvider(GoogleMaps);
    } else {
      this.map = new JsmapsProvider();
    }
  }

  async init(location, element, hublist){
    // console.log(hublist);
    await this.map.init(location, element, hublist);
    this.getHubList();
    // console.log("Test");
  }

  getHubList(){
    this.hubdataProvider.getHubData().on('value', async hubdataSnapshot => {
      this.hubs =  hubdataSnapshot.val();
      // console.log(this.hubs + " Hubdata");
      for(let x of Object.keys(this.hubs)){
        var hublevel2 = this.hubs[x];
        // console.log(hublevel2 + " temp");
        for(let y of Object.keys(hublevel2)){
          this.hublist[y] = this.hubs[x][y];
          var temp = y;
          this.allhubsList.push(temp);
          // console.log(y + " y");
          this.allhubs.push(this.hublist[y]);
          // console.log(this.hublist[y].Long);
          this.locationn = {
            lat: await this.hubs[x][y].Lat,
            lng: await this.hubs[x][y].Long
          };
        }
      }
    });
  }

}
