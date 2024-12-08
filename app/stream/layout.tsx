'use client';

import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useBackNav } from '@/src/hooks/useBackNav';
import Stream from './page';

init({
  debug: false,
  visualDebug: false,
});

export default function StreamLayout() {
  const { ref, focusKey } = useFocusable();

  useBackNav();

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`w-[100vw] min-h-[100vh] h-full`}>
        <Stream />
      </div>
    </FocusContext.Provider>
  );
}
