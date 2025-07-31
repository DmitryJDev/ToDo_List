import {Injectable, signal, computed, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {catchError} from 'rxjs';


export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string;
  createdAt: Date;
}

interface Posts {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  sortBy= signal<'title' | 'createdAt'>('title') ;


  api: string = 'https://jsonplaceholder.typicode.com/posts';
  error = signal<string | null>(null)
  isLoading = signal<boolean>(false)
  notes = signal<Note[]>([]);

  constructor(private http: HttpClient) {
  }
  setSortBy(val:"title" | "createdAt"){

      this.sortBy.set(val)


  }


  loadNotes() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('notes')) {


      this.loadFromLocalStorage()

    } else {

      this.isLoading.set(true);
      this.http.get<Posts[]>(this.api).pipe(map(data => data.slice(0, 5).map(post =>
          ({
            id: post.id,
            title: post.title,
            content: post.body,
            tags: ['work', 'hobby', 'other'][Math.floor(Math.random() * 3)],
            createdAt: new Date()
          })
        )), catchError(err => {
            this.error.set('Error loading')
            this.isLoading.set(false);
            return []
          }
        )
      ).subscribe(data => {
        this.notes.set(data);
        this.isLoading.set(false);
        this.error.set(null);
        this.saveToLocalStorage();
      })
    }


  }

  updateNote(id: number, content: string) {
    this.notes.update(notes =>  notes.map(data=>{
      if(data.id===id){
        return  {...data, content}
      }
      return data
    }) );
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  getError() {
    return this.error.asReadonly();
  }
  selectedTag=signal<string >('all');
  setSelectedTag(tag: string  ) {

    this.selectedTag.set(tag);
  }
  filteredNotes( ) {
    const tagForSelect = this.selectedTag();

    return computed(() =>

    {
     this.sortBy()==='title'? this.notes().sort((a, b) => a.title.localeCompare(b.title)):
       this.notes().sort((a, b) =>  b.createdAt.getTime() - a.createdAt.getTime())


      if(tagForSelect== 'all'){
        return this.notes()
      }else{
        return  this.notes().filter(note=>note.tags.includes(tagForSelect))
      }
    }
    )
  }
  saveToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('notes', JSON.stringify(this.notes()));
    }
  }

  clearLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  }

  private loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('notes');
      if (saved) {
        const parsed = JSON.parse(saved) as Note[];
        const restored = parsed.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        this.notes.set(restored);
      }
    }
  }


  getNotes() {
    return this.notes.asReadonly()
  }

  deleteNote(id: number) {
    this.notes.update(data => data.filter(item => item.id !== id));
    this.saveToLocalStorage();
  }

  addNewNote(note: string) {
    const newNote = {
      id: Math.max(...this.notes().map(note => note.id), 0) + 1,
      title: `My new note # ${Math.max(...this.notes().map(note => note.id), 0) + 1}`,
      content: note,
      tags: 'personal',
      createdAt: new Date()
    }
    this.notes.update(notes => [...notes, newNote]);
    this.saveToLocalStorage();
  }

}
