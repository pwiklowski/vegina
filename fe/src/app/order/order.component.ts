import { Component, OnInit, Input } from "@angular/core";
import { Order } from "../../../../be/src/models";
import { PopupService } from "../popup.service";
import { PlaceUserOrderComponent } from "../popups/place-user-order/place-user-order.component";
import { VegeService } from "../vege.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.less"]
})
export class OrderComponent {
  @Input() order: Order;

  constructor(private popup: PopupService, private vege: VegeService) {}

  openPopup() {
    this.popup.openPopup(PlaceUserOrderComponent, { orderId: this.order._id }, async ()=>{
      this.order = await this.vege.getOrder(this.order._id);
    });
  }
  
  async remove(userOrderId: string) {
    await this.vege.removeUserOrder(this.order._id, userOrderId)
    this.order = await this.vege.getOrder(this.order._id);
  }
}
