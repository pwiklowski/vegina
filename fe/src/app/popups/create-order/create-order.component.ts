import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ViewContainerRef
} from "@angular/core";
import { VegeService } from "../../vege.service";
import { Order } from "../../../../../be/src/models";
import { RestaurantProviderService } from "src/app/restaurant-provider.service";
import { Timepicker, Datepicker, Modal } from "materialize-css";

@Component({
  selector: "app-create-order",
  templateUrl: "./create-order.component.html",
  styleUrls: ["./create-order.component.less"]
})
export class CreateOrderComponent {
  @ViewChild("placeElement") placeElement: ElementRef;
  @ViewChild("datepicker") date: ElementRef;
  @ViewChild("starttime") starttime: ElementRef;
  @ViewChild("endtime") endtime: ElementRef;

  @ViewChild("modal") modalElement: ElementRef;

  placeName: string;
  id: string;
  placeUrl: string;
  status: string;
  start: Date;
  finish: Date;
  deliveryCost: string;
  minimumOrderValue: string;

  isEdit = false;

  restaurants: Array<any>;

  selectedRestaurant: any;

  startTimePicker: Timepicker;
  endTimePicker: Timepicker;
  datePicker: Datepicker;

  modal: Modal;

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
      this.status = order.status;
      this.placeName = order.placeName;
      this.placeUrl = order.placeUrl;
      this.start = order.start;
      this.finish = order.end;
      this.deliveryCost = order.deliveryCost;
    }
  }

  async ngAfterViewInit() {
    this.modal = M.Modal.init(this.modalElement.nativeElement, {});

    this.restaurants = await this.restaurantProvider.getRestaurants();
    const autocomplete = this.restaurants.reduce((map, restaurant) => {
      return { ...map, [restaurant.name]: restaurant.logoUrl };
    });

    M.Autocomplete.init(this.placeElement.nativeElement, {
      data: autocomplete,
      limit: 5,
      onAutocomplete: this.handleAutocomplete.bind(this)
    });

    this.initTimePickers();
  }

  private handleAutocomplete(result: string) {
    this.selectedRestaurant = this.restaurants.find(
      restaurant => restaurant.name === result
    );

    if (this.selectedRestaurant) {
      this.placeName = this.selectedRestaurant.name;
      this.deliveryCost = (
        this.selectedRestaurant.deliveryCosts.costs.costs / 100
      ).toFixed(2);
      this.minimumOrderValue = (
        this.selectedRestaurant.deliveryCosts.minimumAmount / 100
      ).toFixed(2);

      this.placeUrl = this.getRestaurantUrl(this.selectedRestaurant);

      setTimeout(() => M.updateTextFields());
    }
  }

  private initTimePickers() {
    this.startTimePicker = M.Timepicker.init(this.starttime.nativeElement, {
      twelveHour: false,
      container: "body",
      autoClose: true,
      defaultTime: "now"
    });
    this.startTimePicker._updateTimeFromInput();
    this.startTimePicker.done();

    this.endTimePicker = M.Timepicker.init(this.endtime.nativeElement, {
      twelveHour: false,
      container: "body",
      autoClose: true,
      defaultTime: "now",
      fromNow: 60 * 60 * 1000
    });
    this.endTimePicker._updateTimeFromInput();
    this.endTimePicker.done();

    this.datePicker = M.Datepicker.init(this.date.nativeElement, {
      container: "body",
      firstDay: 1,
      autoClose: true,
      minDate: new Date(),
      defaultDate: new Date(),
      setDefaultDate: true
    });
  }

  private getRestaurantUrl(restaurant: Restaurant) {
    return (
      "https://www.pyszne.pl/menu/" +
      restaurant.name.toLowerCase().replace(" ", "-")
    );
  }

  async edit() {
    await this.vege.updateOrder(this.id, {
      deliveryCost: parseFloat(this.deliveryCost),
      end: this.finish,
      placeName: this.placeName,
      placeUrl: this.placeUrl,
      status: this.status,
      minimumOrderValue: parseFloat(this.minimumOrderValue)
    });
    this.close();
  }

  async create() {
    const start = new Date(this.datePicker.date);
    const end = new Date(this.datePicker.date);

    start.setHours(parseInt(this.startTimePicker.time.split(":")[0]));
    start.setMinutes(parseInt(this.startTimePicker.time.split(":")[0]));
    end.setHours(parseInt(this.endTimePicker.time.split(":")[0]));
    end.setMinutes(parseInt(this.endTimePicker.time.split(":")[1]));

    try {
      const order = {
        deliveryCost: parseFloat(this.deliveryCost),
        start: start,
        end: end,
        placeName: this.placeName,
        placeUrl: this.placeUrl,
        minimumOrderValue: parseFloat(this.minimumOrderValue),
        placeMetadata: {
          pyszneId: this.selectedRestaurant
            ? this.selectedRestaurant.id
            : undefined
        }
      };

      console.log(order);
      await this.vege.createOrder(order);
      this.close();
    } catch (err) {
      console.error(err);
      M.toast({ html: "Unable to create order" });
    }
  }

  close() {
    this.modal.close();
  }
}
