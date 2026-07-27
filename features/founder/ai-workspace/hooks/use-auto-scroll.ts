"use client";

import React from "react";

export function useAutoScroll(
  messageSignal: string,
  initialScrollTop?: number,
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldFollowRef = React.useRef(true);
  const initialScrollTopRef = React.useRef(initialScrollTop);
  const previousSignalRef = React.useRef(messageSignal);
  const scrollFrameRef = React.useRef<number | null>(null);

  const onScroll = React.useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    const distanceFromBottom =
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight;
    shouldFollowRef.current = distanceFromBottom < 120;
  }, []);

  React.useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const restoredScrollTop = initialScrollTopRef.current;
    element.scrollTop =
      restoredScrollTop === undefined
        ? element.scrollHeight
        : Math.min(restoredScrollTop, element.scrollHeight);
    const distanceFromBottom =
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight;
    shouldFollowRef.current = distanceFromBottom < 120;
  }, []);

  React.useEffect(() => {
    if (previousSignalRef.current === messageSignal) return;
    previousSignalRef.current = messageSignal;

    const element = containerRef.current;
    if (!element || !shouldFollowRef.current) return;
    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const currentElement = containerRef.current;
      if (currentElement && shouldFollowRef.current) {
        currentElement.scrollTop = currentElement.scrollHeight;
      }
      scrollFrameRef.current = null;
    });
  }, [messageSignal]);

  React.useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    [],
  );

  return { containerRef, onScroll };
}
