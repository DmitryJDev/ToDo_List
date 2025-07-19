import { Routes } from '@angular/router';
import {FirstComp} from './components/first-comp/first-comp';
import {Second} from './components/second-comp/second';

export const routes: Routes = [
  {path:'one', component:FirstComp},
  {path:'two', component:Second},
  {path:'', redirectTo:'one', pathMatch:'full'},

];
