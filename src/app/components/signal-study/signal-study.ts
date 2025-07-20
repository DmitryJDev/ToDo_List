import {Component , OnInit} from '@angular/core';
import {signal, computed, effect} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Todo} from '../../services/todos'
import {toSignal} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signal-study',
  imports: [FormsModule],
  templateUrl: './signal-study.html',
  styleUrl: './signal-study.scss',
  standalone: true,
})
export class SignalStudy implements OnInit {
  newTodoTitle = ''
  showCompleted = signal(true);
  filteredTodos = computed(() => this.showCompleted() ?this.todoSignal().filter(todo => todo.completed): this.todoSignal()  )

  todoSignal = signal<Todo[]>([]);
  private apiString = 'https://jsonplaceholder.typicode.com/todos';
  todoCounter = computed(() => this.todoSignal().length)

  constructor(private http: HttpClient) {

    const todos=toSignal(this.http.get<Todo[]>(this.apiString),{initialValue:[]})
    this.todoSignal.set(todos().filter(todos => todos.id <= 5))

    effect(() => {
      const todos = this.todoSignal();

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('todos', JSON.stringify(todos));
        console.log('Saved to localStorage:', todos);
      } else {
        console.warn('localStorage is not available in this environment');}


    });
  }

  ngOnInit() {
    // this.http.get<Todo[]>(this.apiString).subscribe(data => {
    //   this.todoSignal.set(data.filter(todos => todos.id <= 5))
    // })

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
