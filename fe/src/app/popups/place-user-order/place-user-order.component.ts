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

  public item: string;
  public price: number;
  public comment: string;

  constructor(private vege: VegeService, private cd: ChangeDetectorRef) {
    super();
  }

  init(params: any) {
    this.orderId = params.orderId;
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
}
