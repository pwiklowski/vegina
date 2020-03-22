import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  token: string;
  profile: gapi.auth2.BasicProfile;
  login: Subject<gapi.auth2.BasicProfile> = new Subject<
    gapi.auth2.BasicProfile
  >();

  constructor() {}

  getToken() {
    return this.token;
  }

  getProfile() {
    return this.profile;
  }

  setToken(token: string) {
    this.token = token;
  }

  handleLogin(googleUser: gapi.auth2.GoogleUser) {
    this.profile = googleUser.getBasicProfile();
    this.token = googleUser.getAuthResponse().id_token;
    this.login.next(this.profile);
  }
}
