import { Component } from "@angular/core";
import { PopupComponent } from "../popup/popup.component";
import { VegeService } from "../vege.service";

@Component({
  selector: "app-create-order",
  templateUrl: "./create-order.component.html",
  styleUrls: ["./create-order.component.less"]
})
export class CreateOrderComponent extends PopupComponent {
  place: string;
  placeUrl: string;
  start: Date;
  finish: Date;
  deliveryCost: number;

  constructor(private vege: VegeService) {
    super();
  }

  ngOnInit(): void {}

  async create() {
    await this.vege.createOrder({
      deliveryCost: this.deliveryCost,
      start: this.start,
      end: this.finish,
      placeName: this.place,
      placeUrl: this.placeUrl
    });
    this.onClose.emit();
  }
}
