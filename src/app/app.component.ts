import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from "./components/card/card.component";
import { SliderComponent } from "./components/slider/slider.component";
import { ModalComponent } from "./components/modal/modal.component";
import { ModalService } from './services/modal.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, CardComponent, SliderComponent, ModalComponent]
})
export class AppComponent {
  title = 'jellyfin-vidaa';

  constructor(public modalService: ModalService) { }
}
