import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TokenInterceptor } from 'src/token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrderComponent } from './order/order.component';
import { PlaceUserOrderComponent } from './place-user-order/place-user-order.component';
import { PopupComponent } from './popup/popup.component';
import { UserOrderComponent } from './user-order/user-order.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    UserOrderComponent,
    PlaceUserOrderComponent,
    CreateOrderComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
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
