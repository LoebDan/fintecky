import { Injectable } from '@angular/core';
declare var google;
/*
  Generated class for the JsmapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JsmapsProvider {
  map: any;
  hubob;
  hublist;

  constructor() {
  }

   init(location, element, hublist) {
    let latLng = new google.maps.LatLng(location.latitude, location.longitude);
    let opts = {
      center: latLng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(element.nativeElement, opts);
     for(let marker of Object.keys(hublist)) {
       var position = new google.maps.LatLng(hublist[marker].Lat, hublist[marker].Long);
       var Marker = new google.maps.Marker({position: position, title: marker, content: hublist[marker].Info});
       Marker.setMap(this.map);
       this.addInfoWindow(Marker, hublist[marker].SubArea + " " + hublist[marker].Info);

     }
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  }


