import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DetailsPage } from '../pages/details/details';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { SignupPage } from '../pages/signup/signup';
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { MenitemsProvider } from '../providers/menitems/menitems';
import { ViewbalanceandtransactionhistoryPage} from "../pages/viewbalanceandtransactionhistory/viewbalanceandtransactionhistory";
import { DriverviewpastridesPage} from "../pages/driverviewpastrides/driverviewpastrides";
import { PassengersProvider } from '../providers/passengers/passengers';
import { TopupPage} from "../pages/topup/topup";
import { TransactionsProvider } from '../providers/transactions/transactions';
import { TopupProvider } from '../providers/topup/topup';
import { BalanceProvider } from '../providers/balance/balance';
import { StartapartyPage} from "../pages/startaparty/startaparty";
import { ManageapartyPage} from "../pages/manageaparty/manageaparty";
import { JoinapartyPage} from "../pages/joinaparty/joinaparty";
import { PartyProvider } from '../providers/party/party';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { QuicktopupPage} from "../pages/quicktopup/quicktopup";
import { ViewnotificationsPage} from "../pages/viewnotifications/viewnotifications";
import { RidesProvider } from '../providers/rides/rides';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DashboardPage,
    DetailsPage,
    LoginPage,
    ProfilePage,
    ResetpasswordPage,
    SignupPage,
    ViewbalanceandtransactionhistoryPage,
    DriverviewpastridesPage,
    TopupPage,
    StartapartyPage,
    ManageapartyPage,
    JoinapartyPage,
    QuicktopupPage,
    ViewnotificationsPage,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'HomePage', segment: 'HomePage'  },
        { component: DashboardPage, name: 'DashboardPage', segment: 'DashboardPage'  },
        { component: DetailsPage, name: 'DetailsPage', segment: 'DetailsPage'  },
        { component: LoginPage, name: 'LoginPage', segment: 'LoginPage'  },
        { component: ProfilePage, name: 'ProfilePage', segment: 'ProfilePage'  },
        { component: ResetpasswordPage, name: 'ResetpasswordPage', segment: 'ResetpasswordPage'  },
        { component: SignupPage, name: 'SignupPage', segment: 'SignupPage'  },
        { component: ViewbalanceandtransactionhistoryPage, name: 'ViewbalanceandtransactionhistoryPage', segment: 'ViewbalanceandtransactionhistoryPage'  },
        { component: DriverviewpastridesPage, name: 'DriverviewpastridesPage', segment: 'DriverviewpastridesPage' },
        { component: StartapartyPage, name: 'StartapartyPage', segment: 'StartapartyPage'},
        { component: ManageapartyPage, name: 'ManageapartyPage', segment: 'ManageapartyPage'},
        { component: JoinapartyPage, name: 'JoinapartyPage', segment: 'JoinapartyPage' },
        { component: ViewnotificationsPage, name: 'ViewnotificationsPage', segment: 'ViewnotificationsPage'},
        ]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DashboardPage,
    DetailsPage,
    LoginPage,
    ProfilePage,
    ResetpasswordPage,
    SignupPage,
    ViewbalanceandtransactionhistoryPage,
    DriverviewpastridesPage,
    TopupPage,
    StartapartyPage,
    ManageapartyPage,
    JoinapartyPage,
    QuicktopupPage,
    ViewnotificationsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ProfileProvider,
    MenitemsProvider,
    PassengersProvider,
    MenitemsProvider,
    TransactionsProvider,
    TopupProvider,
    BalanceProvider,
    PartyProvider,
    NotificationsProvider,
    RidesProvider
  ]
})
export class AppModule {}
