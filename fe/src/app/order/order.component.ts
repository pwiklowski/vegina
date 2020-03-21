import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../../../../be/src/models';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit {

  @Input() order: Order;

  constructor() { }

  ngOnInit(): void {
    console.log(this.order)
  }

}
