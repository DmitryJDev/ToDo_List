import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

export interface Todo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})

export class TodosService {
  constructor(private http: HttpClient) {
  }

  todos: Todo[] = [];
  private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject(this.todos);


  loadTodos() {
    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').subscribe(
      {
        next: value => {
          this.todos = value.slice(0, 5)
          this.todosSubject.next([...this.todos])
        }, error: error => {
          console.log(error);
        }, complete: () => {
          console.log('Complete');
        }
      }
    )
  }

  getTodos() {
    return this.todosSubject.asObservable()
  }

  addTodo(newTodo: Todo): void {
    this.todos.push(newTodo)
    this.todosSubject.next([...this.todos])
  }

  deleteTodo(id: number): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.todosSubject.next([...this.todos]);
    }
  }

  updateTodo(id: number): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos[index].completed = !this.todos[index].completed;
      this.todosSubject.next([...this.todos]);
    }

  }

  changeTodoTitle(id: number, title: string) {
    const index = this.todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
        this.todos[index].title=title;
      this.todosSubject.next([...this.todos]);

    }
  }
}



