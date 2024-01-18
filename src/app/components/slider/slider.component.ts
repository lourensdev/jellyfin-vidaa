import { AfterViewInit, Component, ContentChildren, QueryList } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { VK_LEFT, VK_RIGHT, VK_UP, VK_DOWN, VK_ENTER, VK_BACK_SPACE } from '../../utilities/constants';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent implements AfterViewInit {
  @ContentChildren(CardComponent) cards: QueryList<CardComponent> | undefined;
  private cardsArray: CardComponent[] = [];
  private activeCardIndex: number = 0;

  ngOnInit() {
    document.addEventListener("keydown", (ev) => {
        switch (ev.keyCode) {
            case VK_LEFT:
                this.navigateLeft();
                // Handle mandatory key ←
                break;
            case VK_RIGHT:
              this.navigateRight();
                // Handle mandatory key →
                break;
            case VK_UP:
            // Handle mandatory key ↑
                break;
            case VK_DOWN:
            // Handle mandatory key ↓
                break;
            case VK_ENTER:
                // Handle mandatory key Confirm / Select / OK
                break;
            case VK_BACK_SPACE:
                // Handle mandatory key Back / Return
                break;
        }
        // Block the browser from handling the keydown event.
        ev.preventDefault();
    }, false);
  }

  private navigateLeft() {
    if (this.activeCardIndex > 0) {
      this.cardsArray[this.activeCardIndex].isActive = false;
      this.cardsArray[--this.activeCardIndex].setActive();
    }
  }

  private navigateRight() {
    if (this.activeCardIndex < this.cardsArray.length - 1) {
      this.cardsArray[this.activeCardIndex].isActive = false;
      this.cardsArray[++this.activeCardIndex].setActive();
    }
  }

  ngAfterViewInit() {
    if (this.cards) {
      this.cardsArray = this.cards.toArray();
      // Focus the first card
      Promise.resolve().then(() => this.cardsArray[this.activeCardIndex].setActive());
    }
  }
}
