import '@testing-library/jest-dom/vitest'

/**
 * jsdom no implementa ResizeObserver, y react-three-fiber lo necesita para
 * medir el canvas. El polyfill deja que el árbol se monte; **no** hace que
 * WebGL funcione, que sigue sin existir en jsdom.
 */
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
