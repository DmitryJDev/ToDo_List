import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteManager } from './note-manager';

describe('NoteManager', () => {
  let component: NoteManager;
  let fixture: ComponentFixture<NoteManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
