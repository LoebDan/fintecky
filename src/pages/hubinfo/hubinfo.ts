import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HubdataProvider } from '../../providers/hubdata/hubdata';

/**
 * Generated class for the HubinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hubinfo',
  templateUrl: 'hubinfo.html',
})
export class HubinfoPage {
  public hubs = {};
  hublist = {};
  allhubsList = [];
  allhubs = [];

  temp = [];
  hubname: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public hubdataProvider: HubdataProvider,
  ) {
    this.hubdataProvider.getHubData().on('value', async hubdataSnapshot => {
      this.hubs = hubdataSnapshot.val();
      for (let x of Object.keys(this.hubs)) {
        var hublevel2 = this.hubs[x];
        for (let y of Object.keys(hublevel2)) {
          this.hublist[y] = this.hubs[x][y];
          var temp = y;
          let N = Math.floor(Math.random() * 3) + 1;
          this.hublist[y].IMG = 'assets/imgs/' + this.hublist[y].MainArea + N + ".jpg";
          this.allhubsList.push(temp);
          this.allhubs.push(this.hublist[y]);
        }
      }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HubinfoPage');
  }

}
