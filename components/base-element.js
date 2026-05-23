/**
 * @fileoverview Base Custom Element class providing type-safe child query and event listening functions.
 *
 * @template {Record<string, any>} [EventMap=HTMLElementEventMap]
 */
export class BaseElement extends HTMLElement {
  /**
   * @template {keyof EventMap} K
   * @param {K} type
   * @param {((this: BaseElement, ev: EventMap[K]) => any) | EventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(type, listener, options) {
    super.addEventListener(/** @type {string} */ (type), /** @type {EventListener} */ (listener), options);
  }

  /**
   * @template {keyof EventMap} K
   * @param {K} type
   * @param {((this: BaseElement, ev: EventMap[K]) => any) | EventListenerObject} listener
   * @param {boolean | EventListenerOptions} [options]
   */
  removeEventListener(type, listener, options) {
    super.removeEventListener(/** @type {string} */ (type), /** @type {EventListener} */ (listener), options);
  }

  /**
   * Queries a child element inside this component, asserting its type.
   * Returns null if absent or type mismatching.
   *
   * @template {HTMLElement} T
   * @param {string} selector
   * @param {new () => T} Type
   * @returns {T | null}
   */
  queryElement(selector, Type) {
    const el = this.querySelector(selector);
    if (!el) return null;
    if (!(el instanceof Type)) {
      console.warn(
        `Child element matching "${selector}" is not an instance of ${Type.name} inside <${this.tagName.toLowerCase()}>.`
      );
      return null;
    }
    return el;
  }

  /**
   * Queries a required child element inside this component, asserting its type.
   * Throws an error if absent or type mismatching.
   *
   * @template {HTMLElement} T
   * @param {string} selector
   * @param {new () => T} Type
   * @returns {T}
   */
  requireElement(selector, Type) {
    const el = this.querySelector(selector);
    if (!el) {
      throw new Error(`Required child element "${selector}" was not found inside <${this.tagName.toLowerCase()}>.`);
    }
    if (!(el instanceof Type)) {
      throw new Error(
        `Required child element "${selector}" is not an instance of ${Type.name} inside <${this.tagName.toLowerCase()}>.`
      );
    }
    return el;
  }

  /**
   * Queries a global element in the document by ID, asserting its type.
   * Returns null if absent or type mismatching.
   *
   * @template {HTMLElement} T
   * @param {string} id
   * @param {new () => T} Type
   * @returns {T | null}
   */
  queryDocumentElement(id, Type) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (!(el instanceof Type)) {
      console.warn(
        `Global element with id "${id}" is not an instance of ${Type.name}.`
      );
      return null;
    }
    return el;
  }

  /**
   * Dispatches a type-safe custom event from this component.
   *
   * @template {keyof EventMap} K
   * @param {K} type
   * @param {EventMap[K] extends CustomEvent<infer D> ? D : undefined} [detail]
   */
  emit(type, detail) {
    const event = new CustomEvent(/** @type {string} */ (type), { detail });
    this.dispatchEvent(event);
  }
}
