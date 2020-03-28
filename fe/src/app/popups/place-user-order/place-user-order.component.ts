import {
  Component,
  NgZone,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import { VegeService } from "../../vege.service";
import { Modal } from "materialize-css";
import { Subject } from "rxjs";

@Component({
  selector: "app-place-user-order",
  templateUrl: "./place-user-order.component.html",
  styleUrls: ["./place-user-order.component.less"]
})
export class PlaceUserOrderComponent {
  @ViewChild("placeUserOrder") modalElement: ElementRef;
  modal: Modal;

  success = new Subject();

  orderId: string;
  userOrderId: string;

  public item: string;
  public price: string;
  public comment: string;

  constructor(private vege: VegeService, private cd: ChangeDetectorRef) {}

  async ngAfterViewInit() {
    this.modal = M.Modal.init(this.modalElement.nativeElement, {});
  }

  init(params: any) {
    this.orderId = params.orderId;
    this.userOrderId = params.userOrderId;
    this.item = params.item;
    this.price = params.price;
    this.comment = params.comment;
  }

  async addOrder() {
    const userOrder = {
      item: this.item,
      price: parseFloat(this.price),
      comment: this.comment
    };

    await this.vege.addUserOrder(this.orderId, userOrder);
    this.success.next();
  }

  async editOrder() {
    const userOrder = {
      item: this.item,
      price: parseFloat(this.price),
      comment: this.comment
    };

    await this.vege.editUserOrder(this.orderId, this.userOrderId, userOrder);
    this.close();
    this.success.next();
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  isEdit() {
    return !!this.userOrderId;
  }
}
