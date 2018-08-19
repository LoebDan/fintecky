import { Component, ViewChild } from '@angular/core';
import {  Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { AuthProvider } from '../providers/auth/auth';
import {DashboardPage} from "../pages/dashboard/dashboard";
import {MerchantproductsPage} from "../pages/merchantproducts/merchantproducts";
// import {HomePage} from "../pages/home/home";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  public userProfile: any;
  public isDriverShown = false;
  public isPassShown = null;
  public isPartyShown = false;
  public isCreditsShown = null;
  public showMenu: any;
  public notCount;
  CurUser;
  merchant = [];

  loggedOutPages: Array<{ title: string, name: string, component: any,  icon: string }>;
  driverpages: Array<{ title: string, name: string, component: any,  icon: string }>;
  passpages: Array<{ title: string, name: string, component: any,  icon: string }>;
  creditspages: Array<{ title: string, name: string, component: any,  icon: string }>;
  partypages: Array<{ title: string, name: string, component: any,  icon: string }>;

  constructor(
    public authProvider: AuthProvider,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController,
    public events: Events
  ) {

    firebase.initializeApp({
      apiKey: 'AIzaSyCsO9pcpUt1b-TmMMr2mRZrU-30fGocNcI',
      authDomain: 'tester-f1264.firebaseapp.com',
      databaseURL: 'https://tester-f1264.firebaseio.com',
      projectId: 'tester-f1264',
      storageBucket: 'tester-f1264.appspot.com',
      messagingSenderId: '1086749179711'
    });
    firebase.database().ref('/Merchants').once('value', async snapshot => {
        let mech = snapshot.val();
        this.merchant = [];
        for ( const ob of Object.keys(snapshot.val())) {
          this.merchant.push(mech[ob]);
          console.log(ob);
        }
        console.log(snapshot.val());
      }
    );
    this.rootPage = 'LoginPage';
    this.showMenu = false;

    this.menu = menu;
    this.menu.enable(false, 'loggedInMenu');
    // this.menu.enable(false, 'loggedOutMenu');
    this.notCount = 0;

    this.driverpages = [
      { title: 'Register as a Driver', name: 'DriverdetailsPage', component: 'DriverdetailsPage', icon: 'clipboard'  },
    ];
    this.loggedOutPages = [
      { title: 'About Us', name: 'AboutusPage', component: 'AboutusPage', icon: 'information-circle'  },
      { title: 'Contact Us', name: 'ContactusPage', component: 'ContactusPage', icon: 'mail'  },
      { title: 'How To Use Our App', name: 'tutorialPage', component: 'tutorialPage', icon: 'eye'  },
      { title: 'Login', name: 'LoginPage', component: 'LoginPage', icon: 'log-in'  }
    ];

    this.passpages = [
      {title: 'Drivers Needing Passengers', name:'PassjoinridePage', component:'PassjoinridePage', icon: 'people'},
      {title: 'Leaving Now?', name: 'PassridenowPage', component: 'PassridenowPage', icon: 'car' },
      {title: 'Schedule a Ride', name: 'PassrideschedPage', component: 'PassrideschedPage', icon: 'map'  },
      {title: 'Your Rides Awaiting Driver Requests', name:'PassviewschedridePage', component:'PassviewschedridePage', icon: 'time'},
      {title: 'Your Future Rides', name:'PassengerviewpendingridesPage', component:'PassengerviewpendingridesPage', icon: 'timer'},
      {title: 'Your Past Rides', name:'PassengerviewpastridesPage', component:'PassengerviewpastridesPage', icon: 'checkbox'},
    ];

    this.partypages = [
    ];

    this.events.subscribe('user:signup', () => {
      this.driverpages = [
        { title: 'Register as a Driver', name: 'DriverdetailsPage', component: 'DriverdetailsPage', icon: 'clipboard'  },
      ];
    });

    this.events.subscribe('user:details', () => {
      this.menu.enable(true, 'loggedInMenu');
      this.rootPage = 'DashboardPage';
      this.showMenu = true;
    });

    this.events.subscribe('user:login', async() => {
      const userId: string = await firebase.auth().currentUser.uid;
      console.log("This is the event of logging in");
      this.menu.enable(true, 'loggedInMenu');
      // this.menu.enable(false, 'loggedOutMenu');
      console.log(userId + " userID needed to change driver nav");
      this.CurUser = userId;
      this.checkdriver(userId);
      this.checkparty(userId);
      this.getNotCount(userId);
      this.showMenu = true;
      this.rootPage = 'DashboardPage';
      this.nav.setRoot('DashboardPage');
    });

    this.events.subscribe('user:logout', () => {
      this.driverpages = [
        { title: 'Register as a Driver', name: 'DriverdetailsPage', component: 'DriverdetailsPage', icon: 'clipboard'  },
      ];
      this.menu.enable(false, 'loggedInMenu');
      // this.menu.enable(false, 'loggedOutMenu');
      this.showMenu = false;
      this.notCount = 0;
      this.rootPage = 'LoginPage';
    });

    this.events.subscribe('user:driver', () => {
      this.driverpages = [
        { title: 'Passengers Looking For a Ride', name: 'DriverPickUpPassengerPage', component: 'DriverPickUpPassengerPage', icon: 'people'  },
        { title: 'Leaving Now?', name: 'DriverridenowPage', component: 'DriverridenowPage', icon: 'car'  },
        { title: 'Schedule a Ride', name: 'DriverschedridePage', component: 'DriverschedridePage', icon: 'map'  },
        { title: 'Your Future Rides', name: 'DriverfutureridesPage', component: 'DriverfutureridesPage', icon: 'timer'  },
        { title: 'Rides in Progress', name: 'DriverviewridesinprogressPage', component: 'DriverviewridesinprogressPage', icon: 'timer'  },
        { title: 'Your Past Rides', name: 'DriverviewpastridesPage', component: 'DriverviewpastridesPage', icon: 'checkbox'  },
      ];
    });

    this.events.subscribe('user:party', () => {
      this.checkparty(this.CurUser);
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  async getNotCount(userId){
    await firebase.database().ref(`/userProfile/${userId}/Notifications`).orderByChild('Status').equalTo('Unread').on("value", async snapshot => {
      var notCountOb = await snapshot.val();
      this.notCount = 0;
      console.log(notCountOb);
      console.log(userId);
      if (notCountOb != null){
        for(let x of Object.keys(notCountOb)){
          this.notCount += 1;
          console.log(x);
        }
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }

  loaddr(merch) {
    this.nav.push(MerchantproductsPage, {
      data: merch
    });
  }

  loadJeffsProducts() {
    this.nav.push(DashboardPage, {
      data: "Jeff's Place"
    });
  }

  async checkdriver(userid){
    // Check if the driver has registered
    this.userProfile = await firebase.database().ref(`/userProfile/${userid}/DriverID`).once("value");
    console.log(this.userProfile + " userprofile in app compo");
    var driverreg = this.userProfile.val();
    console.log(driverreg + " driverreg");
    if(driverreg != "HasNotRegisteredYet" && driverreg != null){
      console.log(" Sees the driver has registered");
      this.driverpages = [
        { title: 'Passengers Looking For a Ride', name: 'DriverPickUpPassengerPage', component: 'DriverPickUpPassengerPage', icon: 'people'  },
        { title: 'Leaving Now?', name: 'DriverridenowPage', component: 'DriverridenowPage', icon: 'car'  },
        { title: 'Schedule a Ride', name: 'DriverschedridePage', component: 'DriverschedridePage', icon: 'map'  },
        { title: 'Your Future Rides', name: 'DriverfutureridesPage', component: 'DriverfutureridesPage', icon: 'timer'  },
        { title: 'Rides in Progress', name: 'DriverviewridesinprogressPage', component: 'DriverviewridesinprogressPage', icon: 'timer'  },
        { title: 'Your Past Rides', name: 'DriverviewpastridesPage', component: 'DriverviewpastridesPage', icon: 'checkbox'  },
      ];
    }
    else{
      console.log(" driver has not registered");
      this.driverpages = [
        { title: 'Register as a Driver', name: 'DriverdetailsPage', component: 'DriverdetailsPage', icon: 'clipboard'  },
      ];
    }
  }


  toggleDriver(){
    this.isDriverShown = !this.isDriverShown;
  }

  async checkparty(userid){
    // Check if the party exists
    firebase.database().ref(`/userProfile/${userid}/InParty`).on("value", async Snapshot => {
      // console.log(Snapshot + " Parties in app compo");
      var partyreg = Snapshot.val();
      console.log(partyreg + " partyreg");
      if(partyreg == 'No'){
        console.log("No Party");
        this.partypages = [
          {title: 'Start a Party', name:'StartapartyPage', component:'StartapartyPage', icon: 'clipboard' },
          {title: 'Join a Party', name: 'JoinapartyPage', component: 'JoinapartyPage', icon: 'checkbox'  },
        ];
      }
      else{
        console.log("Party does exist");
        this.partypages = [
          {title: 'Current Party', name: 'ManageapartyPage', component: 'ManageapartyPage', icon: 'information-circle' },
        ];
      }
    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.driverpages = [
        { title: 'Register as a Driver', name: 'DriverdetailsPage', component: 'DriverdetailsPage', icon: 'clipboard'  },
      ];
      this.nav.setRoot('LoginPage');
    });
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }
  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    // this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}








