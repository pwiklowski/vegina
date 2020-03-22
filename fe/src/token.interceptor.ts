import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./app/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token: string; // = "ya29.a0Adw1xeUYIoN8OuC2oTI1OdmxNQzST49tFAVjfDDghVaDxi6PCcxDY3e650pwoAnSt0lTUX8inornt0L_3mpifn1h1y0B_p-7GqWOU-M8-zXP9IcNf1AqyfK1q7Puf-zhmkOH8PvrohCDZXmnBhKoBV2xu6VOfwADh8s";

  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });
    return next.handle(request);
  }
}
