import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RestaurantProviderService {
  BASE_URL = "http://localhost:4200/api";

  PROVIDER_NAME = "pyszne";

  code = "31-877"; //TODO make it dunamic based on current location or user input
  latitude = "50.081263"; //TODO make it dunamic based on current location or user input
  longitude = "20.006668"; //TODO make it dunamic based on current location or user input

  constructor(private http: HttpClient) {}

  async getRestaurant(id: string) {
    return this.http
      .get(
        `${this.BASE_URL}/${this.PROVIDER_NAME}/restaurant/${id}?code=${this.code}&latitude=${this.latitude}&longitude=${this.longitude}`
      )
      .toPromise();
  }

  async getRestaurants() {
    return this.http
      .get(
        `${this.BASE_URL}/${this.PROVIDER_NAME}/restaurants?code=${this.code}&latitude=${this.latitude}&longitude=${this.longitude}`
      )
      .toPromise();
  }
}
