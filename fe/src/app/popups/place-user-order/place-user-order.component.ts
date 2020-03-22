import { Component, NgZone, ChangeDetectorRef } from "@angular/core";
import { PopupComponent } from "../popup/popup.component";
import { VegeService } from "../../vege.service";

@Component({
  selector: "app-place-user-order",
  templateUrl: "./place-user-order.component.html",
  styleUrls: ["./place-user-order.component.less"]
})
export class PlaceUserOrderComponent extends PopupComponent {
  orderId: string;
  userOrderId: string;

  public item: string;
  public price: string;
  public comment: string;

  constructor(private vege: VegeService, private cd: ChangeDetectorRef) {
    super();
  }

  init(params: any) {
    this.orderId = params.orderId;
    this.userOrderId = params.userOrderId;
    this.item = params.item;
    this.price = params.price;
    this.comment = params.comment;
  }

  async addOrder() {
    const userOrder = {
      item: this.item,
      price: parseFloat(this.price),
      comment: this.comment
    };

    await this.vege.addUserOrder(this.orderId, userOrder);
    this.onClose.emit();
  }

  async editOrder() {
    const userOrder = {
      item: this.item,
      price: parseFloat(this.price),
      comment: this.comment
    };

    await this.vege.editUserOrder(this.orderId, this.userOrderId, userOrder);
    this.onClose.emit();
  }
}
