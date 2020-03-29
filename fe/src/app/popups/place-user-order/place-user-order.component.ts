import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { VegeService } from "../../vege.service";
import { Modal } from "materialize-css";
import { Subject } from "rxjs";
import { RestaurantProviderService } from "src/app/restaurant-provider.service";

@Component({
  selector: "app-place-user-order",
  templateUrl: "./place-user-order.component.html",
  styleUrls: ["./place-user-order.component.less"]
})
export class PlaceUserOrderComponent {
  @ViewChild("placeUserOrder") modalElement: ElementRef;
  @ViewChild("itemUserOrder") itemElement: ElementRef;

  modal: Modal;

  success = new Subject();

  orderId: string;
  userOrderId: string;
  restaurantId: string;

  public item: string;
  public price: string;
  public comment: string;

  items: Array<any>;

  selectedItem: any;

  constructor(private vege: VegeService, private restaurantProvider: RestaurantProviderService) {}

  async ngAfterViewInit() {
    this.modal = M.Modal.init(this.modalElement.nativeElement, {});
  }

  async init(params: any) {
    console.log(params);
    this.orderId = params.orderId;
    this.userOrderId = params.userOrderId;
    this.item = params.item;
    this.price = params.price;
    this.comment = params.comment;
    this.restaurantId = params.restaurantId;

    if (this.restaurantId) {
      const restaurant = await this.restaurantProvider.getRestaurant(this.restaurantId);
      this.items = restaurant.restaurant.menu[0].categories.categories
        .map(category => {
          return category.products.products.map(product => {
            let sizes = [];
            if (product.sizes) {
              sizes = product.sizes.products.map(product => this.createProduct(product));
            }

            return [...sizes, this.createProduct(product)];
          });
        })
        .reduce((array, items) => {
          const products = items.reduce((a, i) => [...a, ...i], []);

          return [...array, ...products];
        }, []);

      this.initAutocompleteInput();
    }

    setTimeout(() => M.updateTextFields());
  }

  createProduct(rawData) {
    return {
      id: rawData.id,
      name: rawData.name,
      price: rawData.deliveryPrice
    };
  }

  initAutocompleteInput() {
    const autocomplete = this.items.reduce((map, item) => {
      return { ...map, [item.name]: null };
    }, []);

    M.Autocomplete.init(this.itemElement.nativeElement, {
      data: autocomplete,
      limit: 5,
      onAutocomplete: this.handleAutocomplete.bind(this)
    });
  }

  private handleAutocomplete(result: string) {
    this.selectedItem = this.items.find(item => item.name === result);

    if (this.selectedItem) {
      this.item = this.selectedItem.name;
      this.price = (this.selectedItem.price / 100).toFixed(2);

      setTimeout(() => M.updateTextFields());
    }
  }

  async addOrder() {
    const userOrder = {
      item: this.item,
      price: parseFloat(this.price),
      comment: this.comment
    };

    await this.vege.addUserOrder(this.orderId, userOrder);
    this.close();
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
