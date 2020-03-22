import { Component } from "@angular/core";
import { PopupComponent } from "../popup/popup.component";
import { VegeService } from "../vege.service";

@Component({
  selector: "app-place-user-order",
  templateUrl: "./place-user-order.component.html",
  styleUrls: ["./place-user-order.component.less"]
})
export class PlaceUserOrderComponent extends PopupComponent {
  orderId: string;

  item: string;
  price: number;
  comment: string;

  constructor(private vege: VegeService) {
    super();
  }

  ngOnInit(): void {}

  init(params: any) {
    this.orderId = params.orderId;
  }

  addOrder() {
    const userOrder = {
      item: this.item,
      price: this.price,
      comment: this.comment
    };

    this.vege.addUserOrder(this.orderId, userOrder);
    this.onClose.emit();
  }
}
