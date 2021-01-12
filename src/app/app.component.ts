import { Component } from '@angular/core';
import { Model } from './sport/sport.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample-app';

  value: Partial<Model>;

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('Setting model')
      this.value = { sport: "1", team: "2" };
    }, 3000);
  }
}
