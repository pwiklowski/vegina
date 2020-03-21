import { Injectable } from '@angular/core';
import { PlaceUserOrderComponent } from './place-user-order/place-user-order.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  popupComponent: PlaceUserOrderComponent;

  constructor() { }

  openPopup(orderId: string) {
    this.popupComponent.open(orderId);
  }

  register(popupComponent: PlaceUserOrderComponent) {
    this.popupComponent = popupComponent;
  }
}
