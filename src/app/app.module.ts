import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DriverdetailsPage } from '../pages/driverdetails/driverdetails';
import { DriverschedridePage } from '../pages/driverschedride/driverschedride';
import { DriverridenowPage } from '../pages/driverridenow/driverridenow';
import { DetailsPage } from '../pages/details/details';
import { LoginPage } from '../pages/login/login';
import { ContactusPage } from "../pages/contactus/contactus";
import { ProfilePage } from '../pages/profile/profile';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { SignupPage } from '../pages/signup/signup';
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { MenitemsProvider } from '../providers/menitems/menitems';
import { DriverPickUpPassengerPage} from "../pages/driver-pick-up-passenger/driver-pick-up-passenger";
import { ViewbalanceandtransactionhistoryPage} from "../pages/viewbalanceandtransactionhistory/viewbalanceandtransactionhistory";
import { DriverviewpastridesPage} from "../pages/driverviewpastrides/driverviewpastrides";
import { DriverviewridesinprogressPage} from "../pages/driverviewridesinprogress/driverviewridesinprogress";
import { DriverviewpendingridesPage} from "../pages/driverviewpendingrides/driverviewpendingrides";
import { HubdataProvider } from '../providers/hubdata/hubdata';
import { PassengersProvider } from '../providers/passengers/passengers';
import { DriversProvider } from '../providers/drivers/drivers';
import { TopupPage} from "../pages/topup/topup";
import { WithdrawPage} from "../pages/withdraw/withdraw";
import { TransactionsProvider } from '../providers/transactions/transactions';
import { RateuserPage} from "../pages/rateuser/rateuser";
import { CarddetailsPage} from "../pages/carddetails/carddetails";
import { TopupProvider } from '../providers/topup/topup';
import { BalanceProvider } from '../providers/balance/balance';
import { StartapartyPage} from "../pages/startaparty/startaparty";
import { ManageapartyPage} from "../pages/manageaparty/manageaparty";
import { JoinapartyPage} from "../pages/joinaparty/joinaparty";
import { PartyProvider } from '../providers/party/party';
import { JsmapsProvider } from '../providers/jsmaps/jsmaps';
import { MapsProvider } from '../providers/maps/maps';
import { NativemapsProvider } from '../providers/nativemaps/nativemaps';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { FirsttopupPage} from "../pages/firsttopup/firsttopup";
import { HubinfoPage} from "../pages/hubinfo/hubinfo";
import { PassengerviewpastridesPage} from "../pages/passengerviewpastrides/passengerviewpastrides";
import { PassjoinridePage} from "../pages/passjoinride/passjoinride";
import { PassridenowPage } from '../pages/passridenow/passridenow';
import { PassengerviewpendingridesPage} from "../pages/passengerviewpendingrides/passengerviewpendingrides";
import { PassrideschedPage } from '../pages/passridesched/passridesched';
import { PassviewschedridePage} from "../pages/passviewschedride/passviewschedride";
import { QuicktopupPage} from "../pages/quicktopup/quicktopup";
import { GetpartyidProvider } from '../providers/getpartyid/getpartyid';
import { ViewnotificationsPage} from "../pages/viewnotifications/viewnotifications";
import {DriverfutureridesPage} from "../pages/driverfuturerides/driverfuturerides";
import {PartyschedridePage} from "../pages/partyschedride/partyschedride";
import { RidesProvider } from '../providers/rides/rides';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DashboardPage,
    DriverdetailsPage,
    DriverschedridePage,
    PassridenowPage,
    DetailsPage,
    LoginPage,
    ContactusPage,
    PassrideschedPage,
    ProfilePage,
    ResetpasswordPage,
    SignupPage,
    DriverridenowPage,
    DriverPickUpPassengerPage,
    DriverviewpendingridesPage,
    DriverviewridesinprogressPage,
    PassengerviewpendingridesPage,
    ViewbalanceandtransactionhistoryPage,
    DriverviewpastridesPage,
    PassengerviewpastridesPage,
    TopupPage,
    WithdrawPage,
    RateuserPage,
    CarddetailsPage,
    StartapartyPage,
    ManageapartyPage,
    JoinapartyPage,
    FirsttopupPage,
    PassviewschedridePage,
    PassjoinridePage,
    QuicktopupPage,
    HubinfoPage,
    ViewnotificationsPage,
    DriverfutureridesPage,
    PartyschedridePage,
    HubinfoPage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'HomePage', segment: 'HomePage'  },
        { component: DashboardPage, name: 'DashboardPage', segment: 'DashboardPage'  },
        { component: DriverdetailsPage, name: 'DriverdetailsPage', segment: 'DriverdetailsPage'  },
        { component: DriverschedridePage, name: 'DriverschedridePage', segment: 'DriverschedridePage'  },
        { component: PassridenowPage, name: 'PassridenowPage', segment: 'PassridenowPage'  },
        { component: DetailsPage, name: 'DetailsPage', segment: 'DetailsPage'  },
        { component: LoginPage, name: 'LoginPage', segment: 'LoginPage'  },
        { component: ContactusPage, name: 'ContactusPage', segment: 'ContactPage'  },
        { component: PassrideschedPage, name: 'PassrideschedPage', segment: 'PassrideschedPage'  },
        { component: ProfilePage, name: 'ProfilePage', segment: 'ProfilePage'  },
        { component: ResetpasswordPage, name: 'ResetpasswordPage', segment: 'ResetpasswordPage'  },
        { component: SignupPage, name: 'SignupPage', segment: 'SignupPage'  },
        { component: DriverridenowPage, name: 'DriverridenowPage', segment: 'DriverridenowPage'  },
        { component: DriverviewpendingridesPage, name: 'DriverviewpendingridesPage', segment: 'DriverviewpendingridesPage'},
        { component: PassengerviewpendingridesPage, name: 'PassengerviewpendingridesPage', segment: 'PassengerviewpendingridesPage'},
        { component: ViewbalanceandtransactionhistoryPage, name: 'ViewbalanceandtransactionhistoryPage', segment: 'ViewbalanceandtransactionhistoryPage'  },
        { component: DriverviewpastridesPage, name: 'DriverviewpastridesPage', segment: 'DriverviewpastridesPage' },
        { component: DriverPickUpPassengerPage, name: 'DriverPickUpPassengerPage', segment: 'DriverPickUpPassengerPage'},
        { component: DriverviewridesinprogressPage, name: 'DriverviewridesinprogressPage', segment: 'DriverviewridesinprogressPage'},
        { component: PassengerviewpastridesPage, name: 'PassengerviewpastridesPage', segment: 'PassengerviewpastridesPage'},
        { component: StartapartyPage, name: 'StartapartyPage', segment: 'StartapartyPage'},
        { component: ManageapartyPage, name: 'ManageapartyPage', segment: 'ManageapartyPage'},
        { component: JoinapartyPage, name: 'JoinapartyPage', segment: 'JoinapartyPage' },
        { component: PassviewschedridePage, name: 'PassviewschedridePage', segment: 'PassviewschedridePage'},
        { component: PassjoinridePage, name: 'PassjoinridePage', segment: 'PassjoinridePage' },
        { component: HubinfoPage, name: 'HubinfoPage', segment: 'HubinfoPage'},
        { component: ViewnotificationsPage, name: 'ViewnotificationsPage', segment: 'ViewnotificationsPage'},
        { component: DriverfutureridesPage, name: 'DriverfutureridesPage', segment: 'DriverfutureridesPage'},
        { component: CarddetailsPage, name: 'CarddetailsPage', segment: 'CarddetailsPage'},
        { component: HubinfoPage, name: 'HubinfoPage', segment: 'HubinfoPage'},

        { component: FirsttopupPage, name: 'FirsttopupPage', segment: 'FirsttopupPage'},
      ]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DashboardPage,
    DriverdetailsPage,
    DriverschedridePage,
    PassridenowPage,
    DetailsPage,
    LoginPage,
    ContactusPage,
    PassrideschedPage,
    ProfilePage,
    ResetpasswordPage,
    SignupPage,
    DriverridenowPage,
    DriverviewpendingridesPage,
    PassengerviewpendingridesPage,
    ViewbalanceandtransactionhistoryPage,
    DriverviewpastridesPage,
    DriverPickUpPassengerPage,
    DriverviewridesinprogressPage,
    PassengerviewpastridesPage,
    PassridenowPage,
    TopupPage,
    WithdrawPage,
    RateuserPage,
    CarddetailsPage,
    StartapartyPage,
    ManageapartyPage,
    JoinapartyPage,
    FirsttopupPage,
    PassviewschedridePage,
    PassjoinridePage,
    QuicktopupPage,
    HubinfoPage,
    ViewnotificationsPage,
    DriverfutureridesPage,
    PartyschedridePage,


  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ProfileProvider,
    MenitemsProvider,
    HubdataProvider,
    // MapservProvider,
    PassengersProvider,
    MenitemsProvider,
    DriversProvider,
    TransactionsProvider,
    TopupProvider,
    BalanceProvider,
    PartyProvider,
    JsmapsProvider,
    MapsProvider,
    NativemapsProvider,
    GoogleMaps,
    Geolocation,
    NotificationsProvider,
    GetpartyidProvider,
    RidesProvider,

  ]
})
export class AppModule {}
