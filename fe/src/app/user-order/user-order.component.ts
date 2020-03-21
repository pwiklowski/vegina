import { Component, OnInit, Input } from '@angular/core';
import { UserOrder } from '../../../../be/src/models';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.less']
})
export class UserOrderComponent implements OnInit {

  @Input() userOrder: UserOrder;

  constructor() { }

  ngOnInit(): void {
  }

}
