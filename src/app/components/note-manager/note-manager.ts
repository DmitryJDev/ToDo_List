import {Component, OnInit, Signal} from '@angular/core';
import {Note, NoteService} from '../../services/note.service';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-note-manager',
  imports: [DatePipe, FormsModule],
  templateUrl: './note-manager.html',
  styleUrl: './note-manager.scss'
})
export class NoteManager implements OnInit {
  constructor(protected noteService: NoteService) {
  this.noteService.loadNotes()



  }
  notes!:Signal<Note[]> ;
  ngOnInit() {
   this.notes=  this.noteService.getNotes()

  }
  newNote:string=''
  addingNewNote(){
    if(this.newNote){
      this.noteService.addNewNote(this.newNote)
      this.newNote='';
      this.notes=this.noteService.getNotes()
    }

  }
  deleteNote(id:number){
    this.noteService.deleteNote(id)
    this.notes=this.noteService.getNotes()

  }
  clearLocal(){
    this.noteService.clearLocalStorage();
    this.noteService.loadNotes();
    this.notes=this.noteService.getNotes()
  }
  startUpdating:boolean=false;
  idUpdatedNode:number=0;
  updateNote( ){

    this.noteService.updateNote(this.idUpdatedNode,this.newNote)
    // this.notes=this.noteService.getNotes();
  this.startUpdating=false;
    this.newNote=''
  }

  startUpdateNote(id:number,content:string){
    this.startUpdating = true;
    this.newNote=content;
    this.idUpdatedNode=id;
  }

  selectedNote=''
  selectNote(){

      this.noteService.setSelectedTag(this.selectedNote);


    this.notes = this.noteService.filteredNotes()
  }

  setSortBy(event:HTMLSelectElement){
     if(event){
       this.noteService.setSortBy(<"title" | "createdAt">event.value)

     }
    this.notes = this.noteService.filteredNotes()
  }
}
