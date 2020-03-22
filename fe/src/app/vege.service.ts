import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Order,
  UserOrder,
  NewOrder,
  UpdateOrder
} from "../../../be/src/models";

@Injectable({
  providedIn: "root"
})
export class VegeService {
  BASE_URL = "http://localhost:4200/api";

  constructor(private http: HttpClient) {}

  async getProfile() {
    return this.http.get(`${this.BASE_URL}/profile`).toPromise();
  }

  async getOrders() {
    return this.http.get(`${this.BASE_URL}/orders`).toPromise() as Promise<
      Array<Order>
    >;
  }

  async getOrder(orderId: string) {
    return this.http
      .get(`${this.BASE_URL}/orders/${orderId}`)
      .toPromise() as Promise<Order>;
  }

  async updateOrder(orderId: string, order: UpdateOrder) {
    return this.http
      .patch(`${this.BASE_URL}/orders/${orderId}`, order)
      .toPromise() as Promise<Order>;
  }

  async addUserOrder(orderId: string, userOrder: UserOrder) {
    return this.http
      .post(`${this.BASE_URL}/orders/${orderId}`, userOrder)
      .toPromise() as Promise<Array<Order>>;
  }

  async removeUserOrder(orderId: string, userOrderId: string) {
    return this.http
      .delete(`${this.BASE_URL}/orders/${orderId}/${userOrderId}`)
      .toPromise() as Promise<Array<Order>>;
  }

  async createOrder(order: NewOrder) {
    return this.http
      .post(`${this.BASE_URL}/orders`, order)
      .toPromise() as Promise<Array<Order>>;
  }
}
