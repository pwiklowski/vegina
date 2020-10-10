import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { VegeService } from "../../vege.service";
import { Modal } from "materialize-css";
import { Subject } from "rxjs";
import { RestaurantProviderService } from "src/app/restaurant-provider.service";
import { Utils } from "../../utils";

@Component({
  selector: "app-place-user-order",
  templateUrl: "./place-user-order.component.html",
  styleUrls: ["./place-user-order.component.less"],
})
export class PlaceUserOrderComponent {
  @ViewChild("placeUserOrder") modalElement: ElementRef;
  @ViewChild("itemUserOrder") itemElement: ElementRef;

  convertPrice = Utils.convertPrice;
  formatPrice = Utils.formatPrice;

  modal: Modal;

  success = new Subject();

  orderId: string;
  userOrderId: string;
  restaurantId: string;
  optionsModel: Map<string, any> = new Map();

  public item: string;
  public price: string;
  public comment: string;
  public options: any;
  public categoryId: string;
  public itemId: string;

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
    this.price = this.formatPrice(params.price);
    this.comment = params.comment;
    this.restaurantId = params.restaurantId;
    this.categoryId = params.categoryId;
    this.itemId = params.itemId;
    this.options = [];

    if (this.restaurantId) {
      const restaurant = await this.restaurantProvider.getRestaurant(this.restaurantId);
      this.items = restaurant.restaurant.menu[0].categories.categories
        .map((category) => {
          return category.products.products.map((product) => {
            let sizes = [];
            if (product.sizes) {
              sizes = product.sizes.products.map((product) => this.createProduct(category.id, product));
            }

            return [...sizes, this.createProduct(category.id, product)];
          });
        })
        .reduce((array, items) => {
          const products = items.reduce((a, i) => [...a, ...i], []);

          return [...array, ...products];
        }, []);

      if (this.item) {
        params.selectedOptions.map((option) => {
          this.optionsModel.set(option.id, true);
        });
        this.handleAutocomplete(this.item);
      }

      this.initAutocompleteInput();
    }

    setTimeout(() => M.updateTextFields());
  }

  createProduct(categoryId, rawData) {
    return {
      itemId: rawData.id,
      name: rawData.name,
      price: rawData.deliveryPrice,
      description: rawData.description,
      options: rawData.options?.options,
      categoryId: categoryId,
    };
  }

  initAutocompleteInput() {
    const autocomplete = this.items.reduce((map, item) => {
      return { ...map, [item.name]: null };
    }, []);

    M.Autocomplete.init(this.itemElement.nativeElement, {
      data: autocomplete,
      limit: 5,
      onAutocomplete: this.handleAutocomplete.bind(this),
    });
  }

  private handleAutocomplete(result: string) {
    this.selectedItem = this.items.find((item) => item.name === result);

    if (this.selectedItem) {
      this.item = this.selectedItem.name;
      this.price = this.formatPrice(this.selectedItem.price);
      this.options = this.selectedItem.options;
      this.categoryId = this.selectedItem.categoryId;
      this.itemId = this.selectedItem.itemId;

      this.options?.map((option, index) => {
        option.choices.choices.map((choice) => {
          if (!this.optionsModel.has(choice.id)) {
            this.optionsModel.set(choice.id, false);
          }
        });
      });

      setTimeout(() => {
        M.AutoInit(this.modalElement.nativeElement);
        M.updateTextFields();
      });
    }
  }

  getOptions() {
    const options = [];
    const faltOptionlist = this.options?.reduce((sum, option) => {
      return [
        ...sum,
        ...option.choices.choices.map((choice) => {
          console.log(choice);
          return choice;
        }),
      ];
    }, []);
    for (var [key, value] of this.optionsModel.entries()) {
      if (value) {
        const item = faltOptionlist.find((item) => item.id === key);
        options.push({ id: item.id, name: item.name, price: item.deliveryPrice });
      }
    }

    return options;
  }

  async addOrder() {
    const userOrder = {
      item: this.item,
      price: parseFloat(this.price) * 100,
      categoryId: this.categoryId,
      itemId: this.itemId,
      comment: this.comment,
      options: this.getOptions(),
    };

    await this.vege.addUserOrder(this.orderId, userOrder);
    this.close();
    this.success.next();
  }

  async editOrder() {
    const userOrder = {
      item: this.item,
      price: parseFloat(this.price) * 100,
      comment: this.comment,
      options: this.getOptions(),
      categoryId: this.categoryId,
      itemId: this.itemId,
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

  optionChanged(id: string, value: boolean) {
    this.optionsModel.set(id, value);
  }

  radioChanged(selected, choices) {
    choices.map((choice) => {
      this.optionsModel.set(choice.id, selected === choice.id);
    });
  }
}
