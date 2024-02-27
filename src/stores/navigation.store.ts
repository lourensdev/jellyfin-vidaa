import { create } from 'zustand';

type NavigationState = {
  focusPositions: string[][];
  activeFocusPosition: FocusPosition;
  isOnExitModal: boolean;
  pressUpEvent: boolean;
  pressRightEvent: boolean;
  pressDownEvent: boolean;
  pressLeftEvent: boolean;
  pressEnterEvent: boolean;
  pressBackEvent: boolean;
  triggerPress: (property: any) => void;
  pressUp: () => void;
  pressRight: () => void;
  pressDown: () => void;
  pressLeft: () => void;
  pressEnter: () => void;
  pressBack: () => void;
  getFocusPosition: (id: string) => FocusPosition | undefined;
  trackFocusPosition: (id: string) => boolean;
  moveFocusRow: (direction: FocusDirection.UP | FocusDirection.DOWN) => void;
};

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

const RESET_TIMEOUT = 300;

export const useNavigationStore = create<NavigationState>((set, get) => ({
  focusPositions: [['slider-01', 'slider-02']],
  activeFocusPosition: {
    colIndex: 0,
    rowIndex: 0,
  },
  isOnExitModal: false,
  pressUpEvent: false,
  pressRightEvent: false,
  pressDownEvent: false,
  pressLeftEvent: false,
  pressEnterEvent: false,
  pressBackEvent: false,

  triggerPress: (property: any) => {
    set(state => ({ ...state, [property]: true }));
    setTimeout(() => {
      set(state => ({ ...state, [property]: false }));
    }, RESET_TIMEOUT);
  },

  pressUp: () => {
    get().triggerPress('pressUpEvent');
  },
  pressRight: () => {
    get().triggerPress('pressRightEvent');
  },
  pressDown: () => {
    get().triggerPress('pressDownEvent');
  },
  pressLeft: () => {
    get().triggerPress('pressLeftEvent');
  },
  pressEnter: () => {
    get().triggerPress('pressEnterEvent');
  },
  pressBack: () => {
    get().triggerPress('pressBackEvent');
  },

  getFocusPosition: (id: string) => {
    let focusPosition: FocusPosition | undefined;
    get().focusPositions.forEach((col, colIndex) => {
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
  },

  trackFocusPosition: (id: string) => {
    const focusPosition = get().getFocusPosition(id);
    if (focusPosition) {
      return (
        get().activeFocusPosition.colIndex === focusPosition.colIndex &&
        get().activeFocusPosition.rowIndex === focusPosition.rowIndex
      );
    }
    return false;
  },

  moveFocusRow(direction: FocusDirection.UP | FocusDirection.DOWN): void {
    const nextRowIndex =
      direction === FocusDirection.UP
        ? get().activeFocusPosition.rowIndex - 1
        : get().activeFocusPosition.rowIndex + 1;
    if (get().focusPositions[0][nextRowIndex]) {
      get().activeFocusPosition.rowIndex = nextRowIndex;
    }
  },
}));
