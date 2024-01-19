import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  host: {
    class: 'first:ps-overscan last:pe-overscan p-1'
  },
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() isActive: boolean | undefined;

  constructor(private elementRef: ElementRef) {}

  setActive() {
    this.isActive = true;
    this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }
}
