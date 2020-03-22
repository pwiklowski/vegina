import { Component, OnInit, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.less"]
})
export class PopupComponent implements OnInit {
  onClose: EventEmitter<void> = new EventEmitter();

  constructor() {}

  init(params: any) {}

  ngOnInit(): void {}

  close() {
    this.onClose.emit();
  }
}
