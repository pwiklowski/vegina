import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UserOrder } from "../../../../be/src/models";
import { VegeService } from "../vege.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-user-order",
  templateUrl: "./user-order.component.html",
  styleUrls: ["./user-order.component.less"]
})
export class UserOrderComponent implements OnInit {
  @Input() userOrder: UserOrder;

  @Output() remove: EventEmitter<string> = new EventEmitter<string>();

  constructor(private vege: VegeService, private auth: AuthService) {}

  ngOnInit(): void {}

  removeOrder() {
    this.remove.emit(this.userOrder._id);
  }

  canRemove() {
    return this.userOrder.userId === this.auth.getProfile().getId();
  }
}
