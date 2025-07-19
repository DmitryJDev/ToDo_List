import { Component, OnInit, OnDestroy } from '@angular/core';
import {TodosService} from '../../services/todos';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Todo} from '../../services/todos'

@Component({
  selector: 'app-first-comp',
  imports: [
    FormsModule
  ],
  templateUrl: './first-comp.html',
  styleUrl: './first-comp.scss'
})
export class FirstComp implements OnInit , OnDestroy {

  constructor(private todoService:TodosService) {
  }
  subscription!: Subscription;

  items :Todo[]=[];

  ngOnInit(){
  this.todoService.loadTodos()
  this.subscription=  this.todoService.getTodos().subscribe({
    next: data => {
      this.items = data
    }, error: err => {console.log(err)}, complete:()=>{console.log('Complete loading')}
  })
  }
startChanging:boolean=false;
  idChangedTodo!:number;
  todoText:string='';

  addTodo(){

    if(this.todoText){
      let newTodo: Todo = {
        completed: false,
        // id: this.items[this.items.length-1].id + 1,
        id:Math.max(...this.items.map(todo => todo.id), 0) + 1,
        title: this.todoText,
        userId: 1
      }
      this.todoService.addTodo(newTodo);
      this.todoText = ''

    }


  }

  deleteTodo(id:number){
    this.todoService.deleteTodo(id)
  }
  updateTodo(id:number){

    this.todoService.updateTodo(id)
  }
  startTodoTitleChanging(id:number, title:string){
    if(!this.startChanging){
      this.todoText=title;
      this.idChangedTodo=id;
      this.startChanging=!this.startChanging;
    }

  }
  changeTodoTitle(title:string ){
    this.todoService.changeTodoTitle(this.idChangedTodo,title )
    this.todoText = ''
    this.startChanging=!this.startChanging;
    this.idChangedTodo=-1;

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}
