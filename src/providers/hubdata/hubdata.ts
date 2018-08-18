import firebase from 'firebase';
import { Injectable } from '@angular/core';

/*
  Generated class for the HubdataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HubdataProvider {
  public hubs: Array<any>;
  public hubsRef: firebase.database.Reference;

  constructor() {
    this.hubsRef = firebase.database().ref("Hubs/");
  }

  getHubData(): firebase.database.Reference {
    return this.hubsRef;
  }

}
