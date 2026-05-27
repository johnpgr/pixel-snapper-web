export class BaseElement<
  AttributeMap = Record<string, string>,
  EventMap extends HTMLElementEventMap = HTMLElementEventMap
> extends HTMLElement {
  override addEventListener<K extends keyof EventMap>(
    type: K,
    listener: (this: HTMLElement, ev: EventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options);
  }

  override removeEventListener<K extends keyof EventMap>(
    type: K,
    listener: (this: HTMLElement, ev: EventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;

  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    super.removeEventListener(type, listener, options);
  }

  queryAttributeOrNull<K extends keyof AttributeMap>(qualifiedName: K): AttributeMap[K] | null {
    return super.getAttribute(qualifiedName as string) as AttributeMap[K] | null;
  }

  setAttributeValue<K extends keyof AttributeMap>(qualifiedName: K, value: AttributeMap[K]): void {
    super.setAttribute(qualifiedName as string, value as unknown as string);
  }

  queryAttribute<K extends keyof AttributeMap>(qualifiedName: K): AttributeMap[K] {
    const value = this.queryAttributeOrNull(qualifiedName);

    if (!value) {
      throw new Error(
        `Required attribute "${String(qualifiedName)}" is missing on <${this.tagName.toLowerCase()}>.`
      );
    }

    return value;
  }

  queryElementOrNull<T extends HTMLElement>(selector: string, Type: new () => T): T | null {
    const root = this.shadowRoot || this;
    const el = root.querySelector(selector);

    if (!el) return null;
    if (!(el instanceof Type)) {
      console.warn(
        `Child element matching "${selector}" is not an instance of ${Type.name} inside <${this.tagName.toLowerCase()}>.`
      );
      return null;
    }

    return el;
  }

  queryElement<T extends HTMLElement>(selector: string, Type: new () => T): T {
    const el = this.queryElementOrNull(selector, Type);

    if (!el) {
      throw new Error(
        `Required child element matching "${selector}" not found or is not an instance of ${Type.name} inside <${this.tagName.toLowerCase()}>.`
      );
    }

    return el;
  }

  emit<K extends keyof EventMap>(
    type: K,
    detail?: EventMap[K] extends CustomEvent<infer D> ? D : any
  ): void {
    const event = new CustomEvent(type as string, { detail });
    this.dispatchEvent(event);
  }
}
