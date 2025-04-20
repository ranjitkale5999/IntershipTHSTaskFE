import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListstudComponent } from './liststud.component';

describe('ListstudComponent', () => {
  let component: ListstudComponent;
  let fixture: ComponentFixture<ListstudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListstudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListstudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
