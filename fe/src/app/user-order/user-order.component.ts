import { Component, OnInit, Input } from '@angular/core';
import { UserOrder } from '../../../../be/src/models';
import { VegeService } from '../vege.service';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.less']
})
export class UserOrderComponent implements OnInit {

  @Input() userOrder: UserOrder;
  @Input() orderId: string;

  constructor(private vege: VegeService) { }

  ngOnInit(): void {
  }

  remove() {
    this.vege.removeUserOrder(this.orderId, this.userOrder._id)
  }

}
