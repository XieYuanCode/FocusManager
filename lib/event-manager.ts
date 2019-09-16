import Vue from "vue";
import { isObjectEqualVueIntance } from "./is-vue";

class BoundHandlerOptions {
  /**
   * element元素
   */
  public element: Element | Vue;
  /**
   * 事件名称
   */
  public eventName: string;
  /**
   * 事件处理器
   */
  public listener: EventListener;
  /**
   * 绑定this之后的事件处理器
   */
  public boundlistener: EventListener;
  /**
   * 域
   */
  public scope: any;

  constructor(element: Element | Vue, eventName: string, scope: any, handler: EventListener, capture: boolean = false) {
    this.listener = handler;
    this.boundlistener = handler.bind(scope);
    this.element = element;
    this.eventName = eventName;
    this.scope = scope;
  }
}

class EventManager {
  private boundHandlerList: Array<BoundHandlerOptions>;

  constructor() {
    this.boundHandlerList = new Array<BoundHandlerOptions>();
  }

  /**
   * 添加事件监听
   */
  addEventListener(element: Element | Vue, eventName: string, scope: any, listener: EventListener, capture: boolean = false): void {
    const boundHandlerOption: BoundHandlerOptions = new BoundHandlerOptions(element, eventName, scope, listener, capture);
    this.boundHandlerList.push(boundHandlerOption);

    const realHTMLElement: Element = isObjectEqualVueIntance(element) ? (element as Vue).$el : element as Element;

    realHTMLElement.addEventListener(eventName, boundHandlerOption.boundlistener, capture);
  }

  /**
   * 移除事件监听
   */
  removeEventListener(element: Element | Vue, eventName: string, scope: any, listener: EventListener, capture: boolean = false): void {
    this.boundHandlerList.forEach(boundHandler => {
      // tslint:disable-next-line: max-line-length
      if (boundHandler.element === element && boundHandler.eventName === eventName && boundHandler.scope === scope && boundHandler.listener === listener) {
        const realHTMLElement: Element = isObjectEqualVueIntance(element) ? (element as Vue).$el : element as Element;

        realHTMLElement.removeEventListener(eventName, boundHandler.boundlistener, capture);
      }
    });
  }
}

export default EventManager;