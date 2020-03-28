import { Injectable } from "@angular/core";
import { CreateOrderComponent } from "./popups/create-order/create-order.component";
import { UserOrderComponent } from "./user-order/user-order.component";

@Injectable({
  providedIn: "root"
})
export class PopupService {
  createOrderComponent: CreateOrderComponent;
  userOrderComponent: UserOrderComponent;

  init(
    createOrderComponent: CreateOrderComponent,
    userOrderComponent: UserOrderComponent
  ) {
    this.createOrderComponent = createOrderComponent;
    this.userOrderComponent = userOrderComponent;
  }
}
