import { Routes } from '@angular/router';
import {FirstComp} from './components/first-comp/first-comp';
import {Second} from './components/second-comp/second';
import {SignalStudy} from './components/signal-study/signal-study';
import {NoteManager} from './components/note-manager/note-manager';

export const routes: Routes = [
  {path:'one', component:FirstComp},
  {path:'two', component:Second},
  {path:'three', component:SignalStudy},
  {path:'four', component:NoteManager},

  {path:'', redirectTo:'one', pathMatch:'full'},

];
