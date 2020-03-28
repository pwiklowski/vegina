import { Injectable } from "@angular/core";
import { CreateOrderComponent } from "./popups/create-order/create-order.component";
import { UserOrderComponent } from "./user-order/user-order.component";
import { PlaceUserOrderComponent } from "./popups/place-user-order/place-user-order.component";

@Injectable({
  providedIn: "root"
})
export class PopupService {
  createOrderComponent: CreateOrderComponent;
  placeUserOrderComponent: PlaceUserOrderComponent;

  init(
    createOrderComponent: CreateOrderComponent,
    placeUserOrderComponent: PlaceUserOrderComponent
  ) {
    this.createOrderComponent = createOrderComponent;
    this.placeUserOrderComponent = placeUserOrderComponent;
  }
}
