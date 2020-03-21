import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VegeService {

  BASE_URL = "http://127.0.0.1:4200/api"

  constructor(private http: HttpClient) { }

  async getProfile() {
    return this.http.get(this.BASE_URL + "/profile").toPromise();
  }
}
