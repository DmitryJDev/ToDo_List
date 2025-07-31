import {Component, OnInit, Signal} from '@angular/core';
import {signal, computed, effect} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Todo} from '../../services/todos'

import {FormsModule} from '@angular/forms';
import {TodoServiceUsingSignals} from '../../services/todo-service-using-signals';
import {Sign} from 'node:crypto';

@Component({
  selector: 'app-signal-study',
  imports: [FormsModule],
  templateUrl: './signal-study.html',
  styleUrl: './signal-study.scss',
  standalone: true,
})
export class SignalStudy implements OnInit {
  error!:Signal<string|null>
  newTodoTitle = ''
  filteredTodos = computed(() => this.showCompleted() ?this.todoSignal().filter(todo => todo.completed): this.todoSignal()  )
  private apiString = 'https://jsonplaceholder.typicode.com/todos';

  todoSignal = signal<Todo[]>([]);
  todoCounter = computed(() => this.todoSignal().length)
  showCompleted = signal(false);
  todoFiltered:Signal<Todo[]>=signal<Todo[]>([])
  constructor(private todoService:TodoServiceUsingSignals, private http :HttpClient) {
  this.todoService.loadTodos()
  this.http.get<Todo[]>(this.apiString).subscribe(data=>{

    this.todoSignal.set(data.filter(todos=>todos.id<=5))
  })
    this.error = this.todoService.getError();


    effect(() => {
      const todos = this.todoSignal();

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('todos', JSON.stringify(todos));
        console.log('Saved to localStorage:', todos);
      } else {
        console.warn('localStorage is not available in this environment');}


    });
  }

  filtered:string='';
  sortBy: 'title' | 'completed'='title';
  ngOnInit() {


    this.todoFiltered = this.todoService.computedFilteredTodos()

  }
  setSortBy( ) {
   this.todoService.setSortBy(this.sortBy)
  }
  updateSearch(){
    this.todoService.setSearchQuery(this.filtered)
  }

  addTodo() {

    if(this.newTodoTitle.trim()){
      let newTodo: Todo = {
        completed: false,
        id: Math.max(...this.todoSignal().map(value => value.id), 0) + 1,
        title: this.newTodoTitle,
        userId: 1,
      }
      this.todoSignal.update(todos => [...todos, newTodo]);
      this.newTodoTitle = '';
    }

  }

  // Метод для удаления задачи
  deleteTodo(id: number) {
    this.todoSignal.update(todos => todos.filter(todo => todo.id !== id))
  }

  changeStance(id: number) {
    this.todoSignal.update(todos => todos.map(todo => {
      if (todo.id == id) {
        return {...todo, completed: !todo.completed}
      }
      return todo
    }))
  }

}
