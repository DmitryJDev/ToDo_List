import {Injectable } from '@angular/core';


export interface Todo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TodoServiceUsingSignals {




}
