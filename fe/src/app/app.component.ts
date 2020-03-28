import {
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  ChangeDetectorRef,
  NgZone
} from "@angular/core";
import { VegeService } from "./vege.service";
import { Order } from "../../../be/src/models";
import { PopupService } from "./popup.service";
import { CreateOrderComponent } from "./popups/create-order/create-order.component";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent {
  authorized = false;

  profile: any;
  orders: Array<Order>;

  @ViewChild("popupContainer", { read: ViewContainerRef })
  popupContainer: ViewContainerRef;

  constructor(
    private service: VegeService,
    private popupService: PopupService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.auth.login.subscribe(async (profile: gapi.auth2.BasicProfile) => {
      this.zone.run(async () => {
        console.log("logged", profile);
        this.profile = profile;
        this.authorized = true;
        this.orders = await this.service.getOrders();
      });
    });
  }

  ngAfterViewInit() {
    this.popupService.init(this.popupContainer);

    const elems = document.querySelectorAll(".modal");
  }
}
