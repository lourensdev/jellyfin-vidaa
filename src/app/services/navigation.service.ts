import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface FocusPosition {
  colIndex: number;
  rowIndex: number;
}

export enum FocusDirection {
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private focusPositions: string[][] = [['slider-01', 'slider-02']];
  private activeFocusPosition: FocusPosition = {
    colIndex: 0,
    rowIndex: 0,
  };
  private isOnExitModal: boolean = false;

  // Directions
  private upNavigationEvent = new Subject<void>();
  private rightNavigationEvent = new Subject<void>();
  private downNavigationEvent = new Subject<void>();
  private leftNavigationEvent = new Subject<void>();
  // Actions
  private enterNavigationEvent = new Subject<void>();
  private backNavigationEvent = new Subject<void>();

  // Directions
  upNavigation = this.upNavigationEvent.asObservable();
  rightNavigation = this.rightNavigationEvent.asObservable();
  downNavigation = this.downNavigationEvent.asObservable();
  leftNavigation = this.leftNavigationEvent.asObservable();
  // Actions
  enterNavigation = this.enterNavigationEvent.asObservable();
  backNavigation = this.backNavigationEvent.asObservable();

  pressUp(): void {
    this.upNavigationEvent.next();
  }

  pressRight(): void {
    this.rightNavigationEvent.next();
  }

  pressDown(): void {
    this.downNavigationEvent.next();
  }

  getFocusPosition(id: string): FocusPosition | undefined {
    // Add your implementation here
    let focusPosition: FocusPosition | undefined;
    this.focusPositions.forEach((col, colIndex) => {
      col.forEach((row, rowIndex) => {
        if (row === id) {
          focusPosition = {
            colIndex,
            rowIndex,
          };
        }
      });
    });
    return focusPosition;
  }

  pressLeft(): void {
    this.leftNavigationEvent.next();
  }

  pressEnter(): void {
    this.enterNavigationEvent.next();
  }

  pressBack(): void {
    this.backNavigationEvent.next();
  }

  trackFocusPosition(id: string): boolean {
    const focusPosition = this.getFocusPosition(id);
    if (focusPosition) {
      return (
        this.activeFocusPosition.colIndex === focusPosition.colIndex &&
        this.activeFocusPosition.rowIndex === focusPosition.rowIndex
      );
    }
    return false;
  }

  moveFocusRow(direction: FocusDirection.UP | FocusDirection.DOWN): void {
    const nextRowIndex =
      direction === FocusDirection.UP
        ? this.activeFocusPosition.rowIndex - 1
        : this.activeFocusPosition.rowIndex + 1;
    if (this.focusPositions[0][nextRowIndex]) {
      this.activeFocusPosition.rowIndex = nextRowIndex;
    }
  }

  setOnExitModal(state: boolean): void {
    this.isOnExitModal = state;
  }

  getOnExitModal(): boolean {
    return this.isOnExitModal;
  }
}
