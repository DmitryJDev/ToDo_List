import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'second',
  imports: [
    FormsModule
  ],
  template: `<h1>{{title()}}</h1>
    <input type="text" [(ngModel)]="title"  >
  <br>
  <input #fff type="text" [value]="title1()" (input)="title1.set(fff.value)">
  <h2>{{title1()}}</h2>
  `,
  styles: ['h1{color:red}'],
})
export class Second{
  title = signal('Dimka');
  title1 = signal('Dimka1');

}
