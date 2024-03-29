import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { utils } from "protractor";
import { OrderStatus, UserOrder } from "../../../../be/src/models";
import { AuthService } from "../auth.service";
import { PopupService } from "../popup.service";
import { Utils } from "../utils";
import { VegeService } from "../vege.service";

@Component({
  selector: "app-user-order",
  templateUrl: "./user-order.component.html",
  styleUrls: ["./user-order.component.less"],
})
export class UserOrderComponent {
  @ViewChild("optionsDropdown") optionsElement: ElementRef;

  formatPrice = Utils.formatPrice;

  owner = false;
  @Input() userOrder: UserOrder;
  @Input() orderId: string;
  @Input() deliveryCost: number;
  @Input() status: string;
  @Input() restaurantId: string;

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

  constructor(private vege: VegeService, private auth: AuthService, private popup: PopupService) {}

  ngOnInit() {
    this.owner = this.userOrder.userId === this.auth.getProfile().getId();
  }

  ngAfterViewInit() {
    M.Dropdown.init(this.optionsElement.nativeElement, {
      container: "body" as any,
      constrainWidth: false,
    });
  }

  async removeOrder() {
    await this.vege.removeUserOrder(this.orderId, this.userOrder._id);
    this.refresh.emit();
  }

  getOptions() {
    return this.userOrder.options?.map((option) => option.name).join(", ");
  }

  getOptionsPrice() {
    return this.userOrder.options?.reduce((total, option) => option.price + total, 0);
  }

  canRemove() {
    return this.userOrder.userId === this.auth.getProfile().getId();
  }

  canEdit() {
    return this.userOrder.userId === this.auth.getProfile().getId();
  }

  edit() {
    this.popup.placeUserOrderComponent.init({
      orderId: this.orderId,
      userOrderId: this.userOrder._id,
      item: this.userOrder.item,
      comment: this.userOrder.comment,
      price: this.userOrder.price,
      categoryId: this.userOrder.categoryId,
      itemId: this.userOrder.itemId,
      restaurantId: this.restaurantId,
      selectedOptions: this.userOrder.options,
    });
    this.popup.placeUserOrderComponent.open();
    this.popup.placeUserOrderComponent.success.subscribe(() => {
      this.refresh.emit();
    });
  }

  duplicate() {
    this.popup.placeUserOrderComponent.init({
      orderId: this.orderId,
      item: this.userOrder.item,
      comment: this.userOrder.comment,
      price: this.userOrder.price,
      categoryId: this.userOrder.categoryId,
      itemId: this.userOrder.itemId,
      restaurantId: this.restaurantId,
      selectedOptions: this.userOrder.options,
    });
    this.popup.placeUserOrderComponent.open();
    this.popup.placeUserOrderComponent.success.subscribe(() => {
      this.refresh.emit();
    });
  }
}
