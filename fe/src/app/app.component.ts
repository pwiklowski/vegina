import {
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef
} from "@angular/core";
import { VegeService } from "./vege.service";
import { Order } from "../../../be/src/models";
import { PopupService } from "./popup.service";
import { CreateOrderComponent } from './create-order/create-order.component';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent {
  title = "wege-front";

  user: any;
  orders: Array<Order>;

  @ViewChild("popupContainer", { read: ViewContainerRef })
  popupContainer: ViewContainerRef;

  constructor(
    private service: VegeService,
    private popupService: PopupService
  ) {}

  async ngOnInit() {
    this.user = await this.service.getProfile();

    this.orders = await this.service.getOrders();
  }

  ngAfterViewInit() {
    this.popupService.init(this.popupContainer);
  }

  createOrder() {
    this.popupService.openPopup(CreateOrderComponent)
  }
}
