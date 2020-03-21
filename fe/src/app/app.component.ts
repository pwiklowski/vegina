import { Component } from '@angular/core';
import { VegeService } from './vege.service';
import { Order} from '../../../be/src/models'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'wege-front';

  user: any;
  orders: Array<Order>;

  constructor(private service: VegeService) {

  }

  async ngOnInit() {
    this.user = await this.service.getProfile();


    this.orders = await this.service.getOrders();
  }
}
