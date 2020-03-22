import { Component, ChangeDetectorRef } from "@angular/core";
import { PopupComponent } from "../popup/popup.component";
import { VegeService } from "../../vege.service";
import { Order } from "../../../../../be/src/models";

@Component({
  selector: "app-create-order",
  templateUrl: "./create-order.component.html",
  styleUrls: ["./create-order.component.less"]
})
export class CreateOrderComponent extends PopupComponent {
  place: string;
  id: string;
  placeUrl: string;
  status: string;
  start: Date;
  finish: Date;
  deliveryCost: number;

  isEdit = false;

  constructor(private vege: VegeService, private cd: ChangeDetectorRef) {
    super();
  }

  init(params: any) {
    if (params) {
      const order: Order = params.order;

      this.isEdit = true;

      this.id = order._id;
      this.status = order.status;
      this.place = order.placeName;
      this.placeUrl = order.placeUrl;
      this.start = order.start;
      this.finish = order.end;
      this.deliveryCost = order.deliveryCost;
    }
    this.cd.detectChanges();
  }

  ngOnInit(): void {}

  async edit() {
    await this.vege.updateOrder(this.id, {
      deliveryCost: parseFloat(this.deliveryCost),
      end: this.finish,
      placeName: this.place,
      placeUrl: this.placeUrl,
      status: this.status
    });
    this.onClose.emit();
  }

  async create() {
    await this.vege.createOrder({
      deliveryCost: parseFloat(this.deliveryCost),
      start: this.start,
      end: this.finish,
      placeName: this.place,
      placeUrl: this.placeUrl
    });
    this.onClose.emit();
  }
}
