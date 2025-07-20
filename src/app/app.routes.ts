import { Routes } from '@angular/router';
import {FirstComp} from './components/first-comp/first-comp';
import {Second} from './components/second-comp/second';
import {SignalStudy} from './components/signal-study/signal-study';

export const routes: Routes = [
  {path:'one', component:FirstComp},
  {path:'two', component:Second},
  {path:'three', component:SignalStudy},
  {path:'', redirectTo:'one', pathMatch:'full'},

];
