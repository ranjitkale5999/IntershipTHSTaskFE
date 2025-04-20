import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatestudComponent } from './updatestud.component';

describe('UpdatestudComponent', () => {
  let component: UpdatestudComponent;
  let fixture: ComponentFixture<UpdatestudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatestudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatestudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
