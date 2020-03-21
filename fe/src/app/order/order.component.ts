import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../../../../be/src/models';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit {

  @Input() order: Order;

  constructor(private popup: PopupService) { }

  ngOnInit(): void {
    console.log(this.order)
  }

  openPopup(){
    this.popup.openPopup(this.order._id);
  }
}
