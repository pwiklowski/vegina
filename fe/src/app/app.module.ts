import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/token.interceptor';
import { OrderComponent } from './order/order.component';
import { UserOrderComponent } from './user-order/user-order.component';
import { PlaceUserOrderComponent } from './place-user-order/place-user-order.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    UserOrderComponent,
    PlaceUserOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
