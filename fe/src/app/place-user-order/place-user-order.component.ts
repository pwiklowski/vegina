import { Component, OnInit } from '@angular/core';
import { PopupService } from '../popup.service';
import { VegeService } from '../vege.service';

@Component({
  selector: 'app-place-user-order',
  templateUrl: './place-user-order.component.html',
  styleUrls: ['./place-user-order.component.less']
})
export class PlaceUserOrderComponent implements OnInit {

  hidden = true;
  orderId: string;

  constructor(private popupService: PopupService, private vege: VegeService) { }

  ngOnInit(): void {

    this.popupService.register(this);
  }

  open(orderId: string) {
    this.orderId = orderId;
    this.hidden = false;
  }

  addOrder() {
    const userOrder = {
      item: "sdf",
      price: 123
    }

    this.vege.addUserOrder(this.orderId, userOrder);
    this.hidden = true;
  }
}
