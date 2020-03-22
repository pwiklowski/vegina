import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
  Type
} from "@angular/core";
import { PopupComponent } from "./popups/popup/popup.component";

@Injectable({
  providedIn: "root"
})
export class PopupService {
  popupContainer: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  init(container: ViewContainerRef) {
    this.popupContainer = container;
  }

  openPopup(popup, params?: any, onCloseCallback?: Function) {
    const ref = this.componentFactoryResolver.resolveComponentFactory(popup);
    const componentRef = this.popupContainer.createComponent(ref);
    (componentRef.instance as PopupComponent).init(params);
    (componentRef.instance as PopupComponent).onClose.subscribe(() => {
      this.popupContainer.clear();

      if (onCloseCallback) {
        onCloseCallback();
      }
    });
  }
}
