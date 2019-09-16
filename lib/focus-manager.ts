import Vue from "vue";
import CompatibleConfig from "./compatible-config";
import ComponentConfig from "./component-config/component-config";
import componentConfigManager from "./component-config/get-config";
import DefaultFocusList from "./default-focus-list";
import FocusDirection from "./enum/focus-direction";
import FocusEventType from "./enum/focus-event-type";
import FocusTrigger from "./enum/focus-trigger";
import { FocusManagerParamError } from "./error/error";
import EventManager from "./event-manager";
import FocusEventArgs from "./focus-event-args";
import focusKeyCodeTrigger from "./focus-keycode";
import FocusManagerOptions from "./focus-manager-options";
import IFocusable from "./interface/ifocus-able";
import IComponentNavigator from "./interface/icomponent-navigator";
import IFocusList from "./interface/ifocus-list";
import { isObjectEqualVueIntance, isElementExtendsVueComponent } from "./is-vue";
import KeyCode from "./enum/keyCode";
import { Dispatcher } from "focus-manager-common";

class FocusManagerRegistry {
  private static focusManagerList: Set<FocusManager> = new Set<FocusManager>();

  /**
   * 注册一个焦点管理器
   */
  public static register(focusManager: FocusManager): void {
    if (FocusManagerRegistry.focusManagerList.has(focusManager)) {
      throw new FocusManagerParamError(`${JSON.stringify(focusManager)} Is Already Registered, Please Non't Register Again`);
    } else {
      FocusManagerRegistry.focusManagerList.add(focusManager);
    }
  }

  /**
   * 移除一个焦点管理器
   */
  public static unregister(focusManager: FocusManager): void {
    if (FocusManagerRegistry.focusManagerList.has(focusManager)) {
      FocusManagerRegistry.focusManagerList.delete(focusManager);
    } else {
      throw new FocusManagerParamError(`${JSON.stringify(focusManager)} Is Unregistered, Please Register First`);
    }
  }

  /**
   * 获得一个根元素对应的焦点管理器
   * @param root
   */
  public static getFocusManager(root: Element | Vue): FocusManager | null {
    let focusManager: FocusManager | null = null;
    FocusManagerRegistry.focusManagerList.forEach(focusManagerItem => {
      if (focusManagerItem.root === root) {
        focusManager = focusManagerItem;
      }
    });
    return focusManager;
  }
}
class FocusManager {

  //#region Static

  /**
   * 获取焦点管理form表单的列表
   */
  private static createFocusList: (el: Element | Vue) => IFocusList;

  /**
   * 为兼容旧版焦点控制而配置的配置项
   */
  private static compatibleConfig: CompatibleConfig;

  /**
   * 是否连续跳跃标识
   */
  private static continuousJump: boolean;

  /**
   * 是否自动使第一个元素获得焦点标识
   */
  private static isAutoFocusFirstNode: boolean;

  private static navigators: IComponentNavigator;

  /**
   * 配置焦点管理器全局属性
   */
  public static configure(focusManagerOptions: FocusManagerOptions): void {
    // TODO: put to app layer
    Dispatcher.current = focusManagerOptions.dispatcher;
    FocusManager.createFocusList = focusManagerOptions.focusList || ((el) => new DefaultFocusList(el));
    if (focusManagerOptions.compatibleConfig) {
      FocusManager.compatibleConfig = focusManagerOptions.compatibleConfig;
    }
    FocusManager.continuousJump = typeof focusManagerOptions.continuousJump !== "undefined" ? focusManagerOptions.continuousJump : true;
    FocusManager.isAutoFocusFirstNode = focusManagerOptions.isAutoFocusFirstNode || false;
    FocusManager.navigators = FocusManager.navigators;
  }

  /**
   * 获取当前的组件配置详情
   */
  public static getCurrentComponentConfig(): Map<string, ComponentConfig> {
    return componentConfigManager.getComponentsConfig();
  }

  /**
   * 新增自定义或配置当前组件配置
   */
  public static setComponentConfig(componentConfig: ComponentConfig | Map<string, ComponentConfig>): void {
    componentConfigManager.setComponentConfig(componentConfig);
  }

  /**
   * 在当前域添加焦点控制
   */
  public static attach(root: Element | Vue): void {
    if (!root) {
      throw new FocusManagerParamError(`attach neet a param, but got ${root}`);
    }

    const exitsInstence = FocusManagerRegistry.getFocusManager(root);
    if (exitsInstence) {
      return;
    }
    const focusManager: FocusManager = new FocusManager(root);

    FocusManagerRegistry.register(focusManager);
  }
  /**
   * 移除当前域的焦点控制
   */
  public static detach(root: Element | Vue): void {
    if (!root) {
      throw new FocusManagerParamError(`detach neet a param, but got ${root}`);
    }

    const focusManager: FocusManager | null = FocusManagerRegistry.getFocusManager(root);
    if (focusManager) {
      focusManager.removeEventListener();

      FocusManagerRegistry.unregister(focusManager);
    }
  }
  /**
   * 为兼容旧版的检点控制而声明的方法
   */
  public static dettach(): void {
    OldFocusManager.dettach();
  }

  /**
   * 获取一个element对应的焦点管理器
   */
  public static getAttachedFocusManager(element: Element | Vue): FocusManager | undefined {
    let currentElement: Element | Vue | null = element;
    while (currentElement) {
      const focusManager: FocusManager | null = FocusManagerRegistry.getFocusManager(currentElement);
      if (focusManager !== null) {
        return focusManager;
      } else {
        if (isObjectEqualVueIntance(currentElement)) {
          if ((currentElement as Vue).$parent) {
            currentElement = (currentElement as Vue).$parent;
          } else {
            currentElement = null;
          }
        } else {
          if (isElementExtendsVueComponent(currentElement as HTMLElement)) {
            currentElement = (currentElement as any).__vue__;
          } else {
            if ((currentElement as HTMLElement).parentElement !== null) {
              currentElement = (currentElement as HTMLElement).parentElement as HTMLElement;
            } else {
              currentElement = null;
            }
          }
        }
      }
    }
  }

  public static setFocus(element: IFocusable | Element): void {
    if (!element) {
      throw new FocusManagerParamError(`请传入参数`);
    }
    // tslint:disable-next-line: max-line-length
    const focusManager: FocusManager | undefined = FocusManager.getAttachedFocusManager((element as any).component ? (element as IFocusable).component : element as Element);
    if (!focusManager) {
      throw new FocusManagerParamError("元素不在焦点管理列表中");
    }

    let focusNode;
    if ((element as any).component) {
      focusNode = element;
    } else {
      focusNode = focusManager.focusList.findRealElement(element as Element);
    }
    focusManager.tryFocus(focusNode as IFocusable);
  }

  //#endregion

  //#region properties
  /**
   * 跟元素
   */
  public root: Element | Vue;

  /**
   * 当前获得焦点的FocusNode
   */
  private _currentFocusedElement: IFocusable | undefined;
  public get currentFocusedElement(): IFocusable | undefined {
    return this._currentFocusedElement;
  }
  public set currentFocusedElement(value: IFocusable | undefined) {
    this._currentFocusedElement = value;
  }

  /**
   * 上一个获取焦点的元素
   */
  private previousFocusedElement: IFocusable | undefined;

  /**
   * 是否正在处理焦点
   */
  private isProcessingFocus: boolean;

  /**
   * 预测焦点（逻辑焦点）
   */
  private predicatedFocus: IFocusable | undefined;

  /**
   * focuslist
   */
  public focusList: IFocusList;

  /**
   * 事件管理器
   */
  private eventManager: EventManager;

  /**
   * 焦点控制触发原因
   */
  private trigger: FocusTrigger;

  /**
   * 连续跳跃标识
   * 开启状态下焦点将连续跳跃
   * 关闭状态下焦点将不会连续跳跃
   */
  private continuousJump: boolean;

  /**
   * 是否自动使第一个元素获得焦点标识
   */
  private isAutoFocusFirstNode: boolean;

  //#endregion

  //#region constructor
  constructor(root: Element | Vue) {
    this.root = root;
    this.isProcessingFocus = false;
    this.focusList = FocusManager.createFocusList(this.root);
    this.eventManager = new EventManager();
    this.trigger = FocusTrigger.None;
    this.continuousJump = FocusManager.continuousJump;
    this.isAutoFocusFirstNode = FocusManager.isAutoFocusFirstNode;

    this.addEventListeners();

    // 如果配置了第一个元素自动获得焦点
    // 则调用第一个元素的focus方法
    if (this.isAutoFocusFirstNode && this.focusList.getFocusNodeAt(0)) {
      this.focusList.getFocusNodeAt(0).focus();
    }

    console.log("FocusNodeCollection:")
    console.log(this.focusList.focusNodeCollection)

  }
  //#endregion

  //#region methods
  /**
   * 添加事件监听
   */

  private addEventListeners(): void {
    this.eventManager.addEventListener(this.root, "focusin", this, this.focusEventHandler);
    this.eventManager.addEventListener(this.root, "keydown", this, this.keyDownEventHandler);
    this.eventManager.addEventListener(this.root, "click", this, this.clickEventHandler);
  }

  /**
   * 移除当前已经添加的事件监听
   */
  private removeEventListener(): void {
    this.eventManager.removeEventListener(this.root, "focusin", this, this.focusEventHandler);
    this.eventManager.removeEventListener(this.root, "keydown", this, this.keyDownEventHandler);
    this.eventManager.removeEventListener(this.root, "click", this, this.clickEventHandler);
  }

  /**
   * focus事件处理
   */
  private focusEventHandler(event: Event): void {
    this.refreshFocusNodeCollection();

    this.isProcessingFocus = true;

    // 设置当前获得焦点元素
    let realFocusNode: IFocusable | undefined = this.focusList.findRealElement(event.target as Element);

    this.previousFocusedElement = this.currentFocusedElement;

    this.currentFocusedElement = realFocusNode;
  }

  private isParent(element: Element, parentElement: Element): boolean {
    while (element !== undefined && element != null && element.tagName.toUpperCase() !== "BODY") {
      if (element === parentElement) {
        return true;
      }
      element = element.parentElement as Element;
    }
    return false;
  }
  /**
   * 点击事件处理
   */
  private clickEventHandler(event: Event): void {
    this.isProcessingFocus = true;
    this.trigger = FocusTrigger.Mouse;

    if (this.previousFocusedElement) {
      const el = (this.previousFocusedElement.component as Vue).$el || this.previousFocusedElement.component;
      const isContain = this.isParent(event.target as Element, el as Element)
      console.log("isContain", isContain)
      if (!isContain) {
        const nextElement: IFocusable | undefined = this.focusList.findRealElement(event.target as Element);
        if (nextElement) {

          const direction: FocusDirection = this.focusList.getDirection(this.previousFocusedElement, nextElement);
          this.beginPreviewLostFocus(this.previousFocusedElement, nextElement, direction, FocusTrigger.Mouse);
        }
      }
    }

    this.currentFocusedElement = this.focusList.findRealElement(event.target as Element);

    let realFocusNode: IFocusable | undefined = this.focusList.findRealElement(event.target as Element);

    if (realFocusNode && this.focusList.containsFocusNode(realFocusNode)) {
      this.predicatedFocus = realFocusNode;
      // 设置当前获得焦点元素
      this.currentFocusedElement = realFocusNode;
    }
  }

  /**
   * keydown 事件处理
   */
  private keyDownEventHandler(evt: Event): void {
    if (this.currentFocusedElement === void 0) { // 如果没有当前元素 不处理
      return;
    }

    this.trigger = FocusTrigger.Keyboard;
    this.isProcessingFocus = true;
    // 先判断组件是不是会自我处理焦点，如果子午处理焦点，则return，交给组件自己处理
    if (this.focusList.isFocusNodeHandleInternally(this.currentFocusedElement)) {
      const focusNodeNavigator: IComponentNavigator | undefined = this.focusList.getFocusNodeNavigator(this.currentFocusedElement);
      if (focusNodeNavigator) {
        if (focusNodeNavigator.handlesNavigationKey(this.currentFocusedElement, (evt as KeyboardEvent).code as KeyCode)) {
          return;
        }
      }
    }

    let keyboardEvent: KeyboardEvent = evt as KeyboardEvent;

    if (focusKeyCodeTrigger.isGoNextAvailableFocusNode(keyboardEvent)) {
      let realFocusableComponent: IFocusable | undefined = this.focusList.findRealElement(keyboardEvent.target as Element);

      this.currentFocusedElement = realFocusableComponent;

      let sourceNode: IFocusable = this.currentFocusedElement as IFocusable;
      let nextNode: IFocusable | undefined = this.focusList.getNextFocusNode(sourceNode);

      this.predicatedFocus = nextNode;

      const direction: FocusDirection = this.focusList.getDirection(sourceNode, nextNode);

      if (this.focusList.containsFocusNode(sourceNode)) {
        // this.beginPreviewGotFocus(sourceNode, nextNode, direction, FocusTrigger.Code)
        this.beginPreviewLostFocus(sourceNode, nextNode, direction, FocusTrigger.FocusManager);
      }
    } else if (focusKeyCodeTrigger.isGoLastAvailableFocusNode(keyboardEvent)) {
      let realFocusableComponent: IFocusable | undefined = this.focusList.findRealElement(keyboardEvent.target as Element);

      this.currentFocusedElement = realFocusableComponent;

      let sourceNode: IFocusable = this.currentFocusedElement as IFocusable;
      let nextNode: IFocusable | undefined = this.focusList.getPrevFocusNode(sourceNode);

      this.predicatedFocus = nextNode;

      const direction: FocusDirection = this.focusList.getDirection(sourceNode, nextNode);

      if (this.focusList.containsFocusNode(sourceNode)) {
        this.beginPreviewLostFocus(sourceNode, nextNode, direction, FocusTrigger.FocusManager);
      }
    }
  }

  private refreshFocusNodeCollection(): void {
    // this.removeEventListener();
    this.focusList.refresh();
    // this.addEventListeners();
  }

  // tslint:disable-next-line: max-line-length
  beginPreviewGotFocus(oldFocus: IFocusable | undefined, newFocus: IFocusable, direction: FocusDirection, focusTrigger: FocusTrigger): void {
    this.isProcessingFocus = true;
    // tslint:disable-next-line: max-line-length
    const focusEventArgs: FocusEventArgs = new FocusEventArgs(oldFocus, newFocus, direction, focusTrigger, FocusEventType.PreviewGotFocus, this);
    let previewGotFocusEvent: CustomEvent = new CustomEvent(FocusEventType.PreviewGotFocus, {
      detail: focusEventArgs,
      bubbles: true,
      cancelable: true
    });

    // tslint:disable-next-line: max-line-length
    const realElement: HTMLElement = isObjectEqualVueIntance(newFocus.component) ? (newFocus.component as Vue).$el as HTMLElement : (newFocus.component as HTMLElement);

    const cancelled: boolean = realElement.dispatchEvent(previewGotFocusEvent);

    if (cancelled) {
      if (!focusEventArgs.willCompleteAsync || focusEventArgs.isMarkedCompleted) {
        Dispatcher.current.beginInvoke(() => { this.endPreviewGotFocus(focusEventArgs); });
      }
    }
  }
  endPreviewGotFocus(focusEventArgs: FocusEventArgs): void {
    focusEventArgs.isMarkedCompleted = true;
    this.refreshFocusNodeCollection();
    if (focusEventArgs.newFocus) {
      if (this.predicatedFocus && this.predicatedFocus.compare(focusEventArgs.newFocus)) {
        this.beginGotFocus(focusEventArgs.oldFocus, focusEventArgs.newFocus, focusEventArgs.direction, focusEventArgs.focusTrigger);
      }
    }
  }

  // tslint:disable-next-line: max-line-length
  beginGotFocus(oldFocus: IFocusable | undefined, newFocus: IFocusable, direction: FocusDirection, focusTrigger: FocusTrigger): void {
    const focusEventArgs: FocusEventArgs = new FocusEventArgs(oldFocus, newFocus, direction, this.trigger, FocusEventType.GotFocus, this);
    let gotFocusEvent: CustomEvent = new CustomEvent(FocusEventType.GotFocus, {
      detail: focusEventArgs,
      bubbles: true,
      cancelable: true
    });

    // tslint:disable-next-line: max-line-length
    const realElement: HTMLElement = isObjectEqualVueIntance(newFocus.component) ? (newFocus.component as Vue).$el as HTMLElement : (newFocus.component as HTMLElement);

    const cancelled: boolean = realElement.dispatchEvent(gotFocusEvent);

    if (cancelled) {
      if (!focusEventArgs.willCompleteAsync || focusEventArgs.isMarkedCompleted) {
        Dispatcher.current.beginInvoke(() => { this.endGotFocus(focusEventArgs); });
      }
    }
  }
  endGotFocus(focusEventArgs: FocusEventArgs): void {
    if (focusEventArgs.newFocus && focusEventArgs.newFocus.compare(this.predicatedFocus as IFocusable)) {

      focusEventArgs.newFocus.focus();

      this.currentFocusedElement = focusEventArgs.newFocus;
      this.predicatedFocus = this.focusList.getNextFocusNode(focusEventArgs.newFocus);
    } else {
      this.predicatedFocus = focusEventArgs.newFocus;
      this.endGotFocus(focusEventArgs);
    }
    this.isProcessingFocus = false;
    this.refreshFocusNodeCollection();
  }

  // tslint:disable-next-line: max-line-length
  beginPreviewLostFocus(oldFocus: IFocusable | undefined, newFocus: IFocusable | undefined, direction: FocusDirection, focusTrigger: FocusTrigger): void {
    // tslint:disable-next-line: max-line-length
    const focusEventArgs: FocusEventArgs = new FocusEventArgs(oldFocus, newFocus, direction, focusTrigger, FocusEventType.PreviewLostFocus, this);
    const previewLostFocusEvent: CustomEvent = new CustomEvent(FocusEventType.PreviewLostFocus, {
      detail: focusEventArgs,
      bubbles: true,
      cancelable: true,
    });
    if (oldFocus) {
      // tslint:disable-next-line: max-line-length
      const realElement: Element = isObjectEqualVueIntance(oldFocus.component) ? (oldFocus.component as Vue).$el as Element : oldFocus.component as Element;

      const cancelled: boolean = realElement.dispatchEvent(previewLostFocusEvent);

      if (cancelled) {
        if (!focusEventArgs.willCompleteAsync || focusEventArgs.isMarkedCompleted) {
          Dispatcher.current.beginInvoke(() => {
            if (this.trigger === FocusTrigger.Keyboard) {
              this.refreshFocusNodeCollection()
              const nextFocusNode = this.focusList.getNextFocusNode(oldFocus)
              this.predicatedFocus = nextFocusNode;
              focusEventArgs.newFocus = nextFocusNode;
            }
            this.endPreviewLostFoucs(focusEventArgs);
          });
        }
      }
    }


  }
  endPreviewLostFoucs(focusEventArgs: FocusEventArgs): void {
    focusEventArgs.isMarkedCompleted = true;

    this.refreshFocusNodeCollection();

    // 预测焦点为空， 即元素为最后一个元素
    if (this.predicatedFocus === void 0 && focusEventArgs.newFocus === void 0) {
      this.beginLostFocus(focusEventArgs.oldFocus, focusEventArgs.newFocus, focusEventArgs.direction, focusEventArgs.focusTrigger);
    }
    if (focusEventArgs.newFocus && this.predicatedFocus && this.predicatedFocus.compare(focusEventArgs.newFocus)) {
      this.beginLostFocus(focusEventArgs.oldFocus, focusEventArgs.newFocus, focusEventArgs.direction, focusEventArgs.focusTrigger);
    } else {
      focusEventArgs.newFocus = this.predicatedFocus;
      this.endLostFocus(focusEventArgs);
    }
  }

  // tslint:disable-next-line: max-line-length
  beginLostFocus(oldFocus: IFocusable | undefined, newFocus: IFocusable | undefined, direction: FocusDirection, focusTrigger: FocusTrigger): void {
    const focusEventArgs: FocusEventArgs = new FocusEventArgs(oldFocus, newFocus, direction, focusTrigger, FocusEventType.LostFocus, this);
    const lostFocusEvent: CustomEvent = new CustomEvent(FocusEventType.LostFocus, {
      detail: focusEventArgs,
      bubbles: true,
      cancelable: true
    });

    if (oldFocus) {
      // tslint:disable-next-line: max-line-length
      const realElement: Element = isObjectEqualVueIntance(oldFocus.component) ? (oldFocus.component as Vue).$el as Element : oldFocus.component as Element;

      const cancelled: boolean = realElement.dispatchEvent(lostFocusEvent);

      if (cancelled) {
        if (!focusEventArgs.willCompleteAsync || focusEventArgs.isMarkedCompleted) {
          Dispatcher.current.beginInvoke(() => { this.endLostFocus(focusEventArgs); });
        }
      }
    }
  }

  endLostFocus(focusEventArgs: FocusEventArgs): void {
    focusEventArgs.isMarkedCompleted = true;
    if (focusEventArgs.oldFocus) {
      // tslint:disable-next-line: max-line-length
      const realElement: HTMLElement = isObjectEqualVueIntance(focusEventArgs.oldFocus.component) ? (focusEventArgs.oldFocus.component as Vue).$el as HTMLElement : focusEventArgs.oldFocus.component as HTMLElement;
      realElement.blur();
      this.predicatedFocus = focusEventArgs.newFocus;
      this.currentFocusedElement = undefined;
    }
    this.refreshFocusNodeCollection();
    this.isProcessingFocus = false;

    if (this.continuousJump) {
      if (focusEventArgs.newFocus && this.predicatedFocus && this.predicatedFocus.compare(focusEventArgs.newFocus)) {
        this.beginPreviewGotFocus(focusEventArgs.oldFocus, focusEventArgs.newFocus, focusEventArgs.direction, focusEventArgs.focusTrigger);
      }
    }
  }

  tryFocus(focusNode: IFocusable): void {
    if (this.isProcessingFocus) {
      this.predicatedFocus = focusNode;
    } else {
      focusNode.focus();
    }
  }
  //#endregion
}

export default FocusManager;
