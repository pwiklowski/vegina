import { Component, OnInit, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.less"]
})
export class PopupComponent implements OnInit {
  hidden = false;

  onClose: EventEmitter<void> = new EventEmitter();

  constructor() {}

  init(params: any) {}

  ngOnInit(): void {}

  show() {
    this.hidden = false;
  }

  close() {
    this.hidden = true;
    this.onClose.emit();
  }
}
