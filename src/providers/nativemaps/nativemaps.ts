import { Injectable } from '@angular/core';
import { GoogleMaps, LatLng, GoogleMapsEvent } from '@ionic-native/google-maps';
declare var google;

/*
  Generated class for the NativemapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NativemapsProvider {
  map: any;

  constructor(public googleMaps: GoogleMaps) {

  }

  init(location, element, hublist){

    let latLng = new LatLng(location.latitude, location.longitude);

    let opts = {
      camera: {
        latLng: latLng,
        zoom: 11,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(element.nativeElement, opts);

    for(let marker of Object.keys(hublist)) {
      console.log("Test");
      var position = new google.maps.LatLng(hublist[marker].Lat, hublist[marker].Lat);
      var Marker = new google.maps.Marker({position: position, title: hublist[marker].Info});
      Marker.setMap(this.map);
      console.log(position + " po");
      console.log(marker + " marker");
      console.log(Marker + " Marker");
      console.log(hublist[marker].Lat + " Lat");
    }

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');
    });

  }

}
