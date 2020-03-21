import { Component } from '@angular/core';
import { VegeService } from './vege.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'wege-front';

  user: any;

  constructor(private service: VegeService) {

  }

  async ngOnInit() {
    this.user = await this.service.getProfile();
  }
}
