import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Restaurant } from "../../../providers/pyszne/src/model";

@Injectable({
  providedIn: "root",
})
export class RestaurantProviderService {
  BASE_URL = "/api";

  PROVIDER_NAME = "pyszne";

  code = "31-877"; //TODO make it dunamic based on current location or user input
  latitude = "50.081263"; //TODO make it dunamic based on current location or user input
  longitude = "20.006668"; //TODO make it dunamic based on current location or user input

  constructor(private http: HttpClient) {}

  async getRestaurant(id: string) {
    const query = `code=${this.code}&latitude=${this.latitude}&longitude=${this.longitude}`;
    return this.http.get(`${this.BASE_URL}/${this.PROVIDER_NAME}/restaurant/${id}?${query}`).toPromise() as any;
  }

  async getRestaurants(): Promise<Array<any>> {
    const query = `code=${this.code}&latitude=${this.latitude}&longitude=${this.longitude}`;
    return this.http.get(`${this.BASE_URL}/${this.PROVIDER_NAME}/restaurants?${query}`).toPromise() as Promise<Array<Restaurant>>;
  }
}
