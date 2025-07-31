import {computed, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs';


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
  private apiString = 'https://jsonplaceholder.typicode.com/todos';
  todo$ = signal<Todo[]>([]);
  searchQuery = signal<string>('')
  sortBy = signal<'title' | 'completed'>('title')

  constructor(private http: HttpClient) {
  }
  private error = signal<string | null>(null);
  getError() {
    return this.error.asReadonly();
  }
  loadTodos(){
    this.http.get<Todo[]>(this.apiString).pipe(catchError(error=>{
      this.error.set('Failed to load todos. Please try again later.');
      return []
    })).subscribe(todos=>
    {
      this.todo$.set(todos)
      this.error.set(null)
    }
    )

  }
  getFilteredTodos() {
    return this.todo$.asReadonly();
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setSortBy(sortBy: 'title' | 'completed') {
    this.sortBy.set(sortBy);
  }

  computedFilteredTodos(){
    return computed(()=>{
      let filteredTodos = [...this.todo$()];
      if(this.sortBy()==="title"){
        filteredTodos.sort((a,b) =>a.title.localeCompare(b.title))
      }else if(this.sortBy()==="completed"){
        filteredTodos.sort((a,b)=>a.completed===b.completed?0:a.completed?-1:1)
      }

      let query = this.searchQuery().toLowerCase();
      if (query){
        filteredTodos=filteredTodos.filter(todo=>
          todo.title.toLowerCase().includes(query)
        )
      }



      return filteredTodos
    })
  }


}
