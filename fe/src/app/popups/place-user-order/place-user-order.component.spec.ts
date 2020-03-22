import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceUserOrderComponent } from './place-user-order.component';

describe('PlaceUserOrderComponent', () => {
  let component: PlaceUserOrderComponent;
  let fixture: ComponentFixture<PlaceUserOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceUserOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceUserOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
