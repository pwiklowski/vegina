import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UserOrder } from "../../../../be/src/models";
import { VegeService } from "../vege.service";
import { AuthService } from "../auth.service";
import { PopupService } from "../popup.service";
import { PlaceUserOrderComponent } from "../popups/place-user-order/place-user-order.component";

@Component({
  selector: "app-user-order",
  templateUrl: "./user-order.component.html",
  styleUrls: ["./user-order.component.less"]
})
export class UserOrderComponent implements OnInit {
  @Input() userOrder: UserOrder;
  @Input() orderId: string;

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private vege: VegeService,
    private auth: AuthService,
    private popup: PopupService
  ) {}

  ngOnInit(): void {}

  async removeOrder() {
    await this.vege.removeUserOrder(this.orderId, this.userOrder._id);
    this.refresh.emit();
  }

  canRemove() {
    return this.userOrder.userId === this.auth.getProfile().getId();
  }

  canEdit() {
    return this.userOrder.userId === this.auth.getProfile().getId();
  }

  edit() {
    this.popup.openPopup(
      PlaceUserOrderComponent,
      {
        orderId: this.orderId,
        userOrderId: this.userOrder._id,
        item: this.userOrder.item,
        comment: this.userOrder.comment,
        price: this.userOrder.price
      },
      async () => {
        this.refresh.emit();
      }
    );
  }

  duplicate() {
    this.popup.openPopup(
      PlaceUserOrderComponent,
      {
        orderId: this.orderId,
        item: this.userOrder.item,
        comment: this.userOrder.comment,
        price: this.userOrder.price
      },
      async () => {
        this.refresh.emit();
      }
    );
  }
}
