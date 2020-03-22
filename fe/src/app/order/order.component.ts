import { Component, OnInit, Input, NgZone } from "@angular/core";
import { Order } from "../../../../be/src/models";
import { PopupService } from "../popup.service";
import { PlaceUserOrderComponent } from "../popups/place-user-order/place-user-order.component";
import { VegeService } from "../vege.service";
import { CreateOrderComponent } from "../popups/create-order/create-order.component";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.less"]
})
export class OrderComponent {
  @Input() order: Order;

  constructor(
    private popup: PopupService,
    private vege: VegeService,
    private zone: NgZone,
    private auth: AuthService
  ) {}

  canEdit() {
    return this.order.masterUserId === this.auth.getProfile().getId();
  }

  openPopup() {
    this.popup.openPopup(
      PlaceUserOrderComponent,
      { orderId: this.order._id },
      async () => {
        this.zone.run(async () => {
          this.order = await this.vege.getOrder(this.order._id);
        });
      }
    );
  }

  async remove(userOrderId: string) {
    this.zone.run(async () => {
      await this.vege.removeUserOrder(this.order._id, userOrderId);
      this.order = await this.vege.getOrder(this.order._id);
    });
  }

  edit() {
    this.popup.openPopup(CreateOrderComponent, { order: this.order }, () => {
      this.zone.run(async () => {
        this.order = await this.vege.getOrder(this.order._id);
      });
    });
  }
}
