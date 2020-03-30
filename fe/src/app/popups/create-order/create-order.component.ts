import { Component, ChangeDetectorRef, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { VegeService } from "../../vege.service";
import { Order } from "../../../../../be/src/models";
import { RestaurantProviderService } from "src/app/restaurant-provider.service";
import { Timepicker, Datepicker, Modal } from "materialize-css";
import { TranslationWidth } from "@angular/common";
import { Subject } from "rxjs";

@Component({
  selector: "app-create-order",
  templateUrl: "./create-order.component.html",
  styleUrls: ["./create-order.component.less"]
})
export class CreateOrderComponent {
  @ViewChild("placeElement") placeElement: ElementRef;
  @ViewChild("datepicker") date: ElementRef;
  @ViewChild("endtime") endtime: ElementRef;

  @ViewChild("modal") modalElement: ElementRef;

  @ViewChild("orderStatusElement") orderStatusElement: ElementRef;

  success = new Subject();

  placeName: string;
  id: string;
  placeUrl: string;
  orderStatus: string;
  start: Date;
  finish: Date;
  deliveryCost: string;
  minimumOrderValue: string;

  isEdit = false;

  restaurants: Array<any>;

  selectedRestaurant: any;

  endTimePicker: Timepicker;
  datePicker: Datepicker;
  orderStatusSelect: any;

  modal: Modal;

  statuses = [
    {
      value: "STARTED",
      text: "Started"
    },
    {
      value: "FINISHED",
      text: "Finished"
    },
    {
      value: "ORDERED",
      text: "Ordered"
    },
    {
      value: "DELIVERED",
      text: "Delivered"
    },
    {
      value: "CANCELED",
      text: "Canceled"
    }
  ];

  constructor(
    private vege: VegeService,
    private cd: ChangeDetectorRef,
    private restaurantProvider: RestaurantProviderService,
    private element: ElementRef,
    private vc: ViewContainerRef
  ) {}

  init(params: any) {
    if (params) {
      const order: Order = params.order;

      this.isEdit = true;

      this.id = order._id;
      this.orderStatus = order.status;
      this.placeName = order.placeName;
      this.placeUrl = order.placeUrl;

      const start = new Date(order.start);
      const end = new Date(order.end);

      this.datePicker.setDate(start);
      //https://github.com/Dogfalo/materialize/issues/6074
      (this.datePicker as any)._finishSelection();

      this.endtime.nativeElement.value = `${end.getHours()}:${end.getMinutes()}`;

      (this.endTimePicker as any)._updateTimeFromInput();
      (this.endTimePicker as any).done();

      this.minimumOrderValue = order.minimumOrderValue;
      this.deliveryCost = order.deliveryCost;

      setTimeout(() => {
        M.updateTextFields();
        this.orderStatusSelect = M.FormSelect.init(this.orderStatusElement.nativeElement, {});
      });
    }
  }

  async ngAfterViewInit() {
    this.modal = M.Modal.init(this.modalElement.nativeElement, {});

    this.restaurants = await this.restaurantProvider.getRestaurants();
    const autocomplete = this.restaurants.reduce((map, restaurant) => {
      return { ...map, [restaurant.name]: restaurant.logoUrl };
    }, []);

    M.Autocomplete.init(this.placeElement.nativeElement, {
      data: autocomplete,
      limit: 5,
      onAutocomplete: this.handleAutocomplete.bind(this)
    });

    this.initTimePickers();

    this.orderStatusSelect = M.FormSelect.init(this.orderStatusElement.nativeElement, {});
  }

  private handleAutocomplete(result: string) {
    this.selectedRestaurant = this.restaurants.find(restaurant => restaurant.name === result);

    if (this.selectedRestaurant) {
      this.placeName = this.selectedRestaurant.name;
      this.deliveryCost = (this.selectedRestaurant.deliveryCosts.costs.costs / 100).toFixed(2);
      this.minimumOrderValue = (this.selectedRestaurant.deliveryCosts.minimumAmount / 100).toFixed(2);

      this.placeUrl = this.getRestaurantUrl(this.selectedRestaurant);

      setTimeout(() => M.updateTextFields());
    }
  }

  private initTimePickers() {
    this.endTimePicker = M.Timepicker.init(this.endtime.nativeElement, {
      twelveHour: false,
      container: "body",
      autoClose: true,
      defaultTime: "now",
      fromNow: 60 * 60 * 1000
    });
    (this.endTimePicker as any)._updateTimeFromInput();
    (this.endTimePicker as any).done();

    this.datePicker = M.Datepicker.init(this.date.nativeElement, {
      container: "body",
      firstDay: 1,
      autoClose: true,
      //minDate: new Date(),
      defaultDate: new Date(),
      setDefaultDate: true
    });
  }

  private getRestaurantUrl(restaurant) {
    return "https://www.pyszne.pl/menu/" + restaurant.name.toLowerCase().replace(" ", "-");
  }

  async edit() {
    await this.vege.updateOrder(this.id, this.createOrderObject());
    this.close();
    this.success.next();
  }

  private createOrderObject() {
    const end = new Date(this.datePicker.date);

    end.setHours(parseInt(this.endTimePicker.time.split(":")[0]));
    end.setMinutes(parseInt(this.endTimePicker.time.split(":")[1]));

    return {
      deliveryCost: parseFloat(this.deliveryCost),
      end: end,
      placeName: this.placeName,
      placeUrl: this.placeUrl,
      status: this.orderStatusElement.nativeElement.value,
      minimumOrderValue: parseFloat(this.minimumOrderValue),
      placeMetadata: {
        pyszneId: this.selectedRestaurant ? this.selectedRestaurant.id : undefined
      }
    };
  }

  async create() {
    try {
      await this.vege.createOrder(this.createOrderObject());
      this.close();
      this.success.next();
    } catch (err) {
      console.error(err);
      M.toast({ html: "Unable to create order" });
    }
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }
}
