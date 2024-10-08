import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialportComponent } from './serialport.component';

describe('SerialportComponent', () => {
  let component: SerialportComponent;
  let fixture: ComponentFixture<SerialportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerialportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerialportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
