import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramcanComponent } from './tramcan.component';

describe('TramcanComponent', () => {
  let component: TramcanComponent;
  let fixture: ComponentFixture<TramcanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TramcanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TramcanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
