import { Component, Input, NgZone } from "@angular/core";
import { Order } from "../../../../be/src/models";
import { PopupService } from "../popup.service";
import { VegeService } from "../vege.service";
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

  ngAfterViewInit() {
    const elems = document.querySelectorAll(".essensials-item");
    M.Tooltip.init(elems, { position: "top" });
  }

  canEdit() {
    return this.order.masterUserId === this.auth.getProfile().getId();
  }

  openPopup() {
    console.log(this.order);
    this.popup.placeUserOrderComponent.init({
      orderId: this.order._id,
      restaurantId: this.order.placeMetadata.pyszneId
    });
    this.popup.placeUserOrderComponent.open();
    this.popup.placeUserOrderComponent.success.subscribe(() => {
      this.zone.run(async () => {
        this.order = await this.vege.getOrder(this.order._id);
      });
    });
  }

  async refresh() {
    this.zone.run(async () => {
      this.order = await this.vege.getOrder(this.order._id);
    });
  }

  edit() {
    this.popup.createOrderComponent.init({ order: this.order });
    this.popup.createOrderComponent.open();
    this.popup.createOrderComponent.success.subscribe(() => {
      this.zone.run(async () => {
        this.order = await this.vege.getOrder(this.order._id);
      });
    });
  }
}
