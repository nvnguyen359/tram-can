import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTramCanComponent } from './upsert-tram-can.component';

describe('UpsertTramCanComponent', () => {
  let component: UpsertTramCanComponent;
  let fixture: ComponentFixture<UpsertTramCanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertTramCanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpsertTramCanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
