import { useEffect, useRef } from 'react';

export function useStickyOffsets(appRef) {
  const headerRef = useRef(null);
  const scoreBarRef = useRef(null);

  useEffect(() => {
    const appElement = appRef?.current;
    if (!appElement) {
      return undefined;
    }

    const update = () => {
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      const scoreHeight = scoreBarRef.current?.getBoundingClientRect().height ?? 0;
      appElement.style.setProperty('--header-height', `${headerHeight}px`);
      appElement.style.setProperty('--scorebar-height', `${scoreHeight}px`);
      appElement.style.setProperty('--content-offset', `${headerHeight + scoreHeight}px`);
    };

    update();

    const ResizeObserverImpl = window.ResizeObserver;
    let observer;

    if (ResizeObserverImpl) {
      observer = new ResizeObserverImpl(() => update());
      if (headerRef.current) {
        observer.observe(headerRef.current);
      }
      if (scoreBarRef.current) {
        observer.observe(scoreBarRef.current);
      }
    }

    const handleResize = () => update();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [appRef]);

  return { headerRef, scoreBarRef };
}
