declare module "virtual-scroll" {
  interface VirtualScrollOptions {
    el?: Window | HTMLElement;
    mouseMultiplier?: number;
    touchMultiplier?: number;
    firefoxMultiplier?: number;
    keyStep?: number;
    preventTouch?: boolean;
    unpreventTouchClass?: string;
    useKeyboard?: boolean;
    useTouch?: boolean;
    passive?: boolean;
  }

  interface VirtualScrollEvent {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    originalEvent: Event;
  }

  class VirtualScroll {
    constructor(options?: VirtualScrollOptions);
    on(callback: (event: VirtualScrollEvent) => void, context?: any): this;
    off(callback?: (event: VirtualScrollEvent) => void, context?: any): this;
    destroy(): void;
  }

  export default VirtualScroll;
}

