import { Component, ElementRef } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "google-signin",
  template: '<button id="googleBtn">Google Sign-In</button>'
})
export class LoginComponent {
  private clientId: string =
    "118297869536-nnciud01ql0is2htcgj96r53a88ihio4.apps.googleusercontent.com";

  private scope = "profile";

  constructor(private element: ElementRef, private auth: AuthService) {}

  ngAfterViewInit() {
    gapi.load("auth2", () => {
      const auth2: gapi.auth2.GoogleAuth = gapi.auth2.init({
        client_id: this.clientId,
        scope: this.scope,
        redirect_uri: "http://localhost:4200"
      });

      auth2.attachClickHandler(
        this.element.nativeElement.firstChild,
        {},
        googleUser => this.auth.handleLogin(googleUser),
        error => console.error(error)
      );

      auth2.then(() => {
        if (auth2.isSignedIn.get()) {
          this.auth.handleLogin(auth2.currentUser.get());
        }
      });
    });
  }
}
