import Vue, { VNode } from "vue";
import ComponentConfig from "./component-config/component-config";
import ComponentConfigManager from "./component-config/get-config";
import { HTMLElementTagName } from "./component-config/HTML-element-tag-name";
import DefaultComponentSelector from "./default-component-selector";
import { FocusManagerParamError } from "./error/error";
import { FocusNode } from "./focus-node";
import IFocusList from "./interface/ifocus-list";
import { isElementExtendsVueComponent, isObjectEqualVueIntance } from "./is-vue";
import FocusDirection from "./enum/focus-direction";
import IComponentNavigator from "./interface/icomponent-navigator";

export default class DefaultFocusList implements IFocusList {



  /**
   * root节点
   */
  root: Element | Vue;

  /**
   * 组件配置项
   */
  componentConfigs: Map<HTMLElementTagName, ComponentConfig>;

  /**
   * 可获得焦点的元素的标签名集合
   */
  focusNodeTagNameCollection: Array<HTMLElementTagName> = [];

  /**
   * 可获得焦点的元素的集合
   */
  public focusNodeCollection: Array<FocusNode> = [];

  constructor(root: Element | Vue) {
    this.root = root;
    this.componentConfigs = ComponentConfigManager.getComponentsConfig();
    this.updateFocusNodeTagNameCollection();
    this.refresh();
  }

  /**
   * 从 componentConfig 中过滤出可以获得焦点的元素的标签名的集合
   */
  updateFocusNodeTagNameCollection(): void {
    this.componentConfigs.forEach((componentConfig, tagName) => {
      if (componentConfig.focusable && componentConfig.autoFocus) {
        this.focusNodeTagNameCollection.push(tagName);
      }
    });
  }

  /**
   * 更新当前焦点元素集合
   */
  updateFocusNodeCollection(element: Element | Vue): void {
    const componentSelector: DefaultComponentSelector = new DefaultComponentSelector();
    if (componentSelector.isComponentAvailable(this.focusNodeTagNameCollection, element)) {
      // 当前元素满足需求, 直接放在焦点元素集合中
      this.appendElementToFocusNodeCollection((element as any).__vue__ || element);
    } else {
      // 当前元素不满足需求
      if (element && isObjectEqualVueIntance(element)) {
        // 当前元素为Vue实例
        // 遍历Vue实例的$el.children，再次传入updateFocusNodeCollection
        if ((element as Vue).$el && (element as Vue).$el.children) {
          Array.from((element as Vue).$el.children).forEach(child => {
            this.updateFocusNodeCollection(child as HTMLElement);
          });
        }
      } else {
        // 当前元素不是Vue实例，是一个HTML原生元素
        if (isElementExtendsVueComponent(element as HTMLElement)) {
          // 这个HTML元素是一个Vue组件的跟元素
          // 判断HTML对应的Vue实例是不是符合要求
          if (componentSelector.isComponentAvailable(this.focusNodeTagNameCollection, (element as any).__vue__)) {
            // 如果这个HTML对应的Vue实例符合要求，插入FocusNodeCollection中
            this.appendElementToFocusNodeCollection((element as any).__vue__ as Vue);
          } else {
            if (Object.keys(((element as any).__vue__ as Vue).$slots).length > 0) {
              // 这是一个不符合要求，但是有slot的Vue元素，将遍历每一个slot
              const slotObject = ((element as any).__vue__ as Vue).$slots;
              Object.keys(slotObject).forEach(key => {
                if (slotObject[key] !== void 0) {
                  (slotObject[key] as VNode[]).forEach(vNode => {
                    if (vNode.elm) {
                      this.updateFocusNodeCollection(vNode.elm as Element);
                    }
                  })
                }
              })
            }
          }
        } else {
          // 当前原生元素是一个纯正的原生元素
          if ((element as HTMLElement).childNodes.length > 0) {
            // 遍历子元素
            Array.from((element as HTMLElement).children).forEach(children => {
              this.updateFocusNodeCollection(children as HTMLElement);
            });
          }
        }
      }
    }
    this.sortFocusNodeCollectionByPosition();
  }

  /**
   * 根据传入的 element 构造一个 FocusNode 实例，并存入当前 focusNodeCollection
   */
  appendElementToFocusNodeCollection(element: Element | Vue): void {
    const focusNodeInstance: FocusNode = new FocusNode(element);
    this.focusNodeCollection.push(focusNodeInstance);
  }

  /**
   * 刷新当前 focusNodeCollection
   */
  refresh(): void {
    this.focusNodeCollection.length = 0;
    this.updateFocusNodeCollection(this.root);
  }

  /**
   * 根据视觉相对位置, 整理当前的focusNodeCollection
   */
  sortFocusNodeCollectionByPosition(): void {
    let formFieldTemp: FocusNode;
    for (var i: number = 0; i < this.focusNodeCollection.length; i++) {
      for (var j: number = 0; j < this.focusNodeCollection.length - 1 - i; j++) {
        if (this.focusNodeCollection[j].elementTop > this.focusNodeCollection[j + 1].elementTop) {
          formFieldTemp = this.focusNodeCollection[j + 1];
          this.focusNodeCollection[j + 1] = this.focusNodeCollection[j];
          this.focusNodeCollection[j] = formFieldTemp;
        } else if (this.focusNodeCollection[j].elementTop === this.focusNodeCollection[j + 1].elementTop) {
          if (this.focusNodeCollection[j].elementLeft > this.focusNodeCollection[j + 1].elementLeft) {
            formFieldTemp = this.focusNodeCollection[j + 1];
            this.focusNodeCollection[j + 1] = this.focusNodeCollection[j];
            this.focusNodeCollection[j] = formFieldTemp;
          }
        }
      }
    }
  }

  /**
   * 判断传入的两个元素的Direction
   */
  getDirection(firstFocusNode: FocusNode, secondFocusNode: FocusNode | undefined): FocusDirection {

    if (secondFocusNode === void 0) {
      return FocusDirection.Stay;
    }
    const index: number = this.indexOf(firstFocusNode) - this.indexOf(secondFocusNode);

    if (index === 0) {
      return FocusDirection.Stay;
    } else if (index > 0) {
      return FocusDirection.Backward;
    } else {
      return FocusDirection.Forward;
    }
  }

  /**
   * 禁用当前所有的FocusNode
   */
  public disableAllFocusNodes(): Array<FocusNode> {
    let tempFocusNodeCollection: Array<FocusNode> = [];
    this.focusNodeCollection.forEach(focusNode => {
      if (isObjectEqualVueIntance(focusNode.component)) {
        if (!(focusNode.component as Vue).$el.hasAttribute("disabled")) {
          tempFocusNodeCollection.push(focusNode);
        }
      } else {
        if (!(focusNode.component as HTMLElement).hasAttribute("disabled")) {
          tempFocusNodeCollection.push(focusNode);
        }
      }
    });
    tempFocusNodeCollection.forEach(tempFocusNode => {
      if (isObjectEqualVueIntance(tempFocusNode.component)) {
        (tempFocusNode.component as Vue).$el.setAttribute("disabled", "true");
      } else {
        (tempFocusNode.component as HTMLElement).setAttribute("disabled", "true");
      }
    });
    return tempFocusNodeCollection;
  }

  /**
   * 启动传入的FocusNode
   */
  public enableAllFocusNodes(disabledFocusNodeCollection: Array<FocusNode>): void {
    disabledFocusNodeCollection.forEach(disabledfocusNode => {
      if (isObjectEqualVueIntance(disabledfocusNode.component)) {
        (disabledfocusNode.component as Vue).$el.removeAttribute("disabled");
      } else {
        (disabledfocusNode.component as HTMLElement).removeAttribute("disabled");
      }
    });
  }

  /**
   * 判断特定FocusNode是不是FocusNodeCollection的最后一项
   */
  public isLastFocusNode(focusNode: FocusNode): boolean {
    return focusNode.compare(this.focusNodeCollection[this.focusNodeCollection.length - 1]);
  }

  /**
   * 判断特定FocusNode是不是FocusNodeCollection的第一项
   */
  public isFirstFocusNode(focusNode: FocusNode): boolean {
    return focusNode.compare(this.focusNodeCollection[0]);
  }

  /**
   * 判断特定的FocusNode是不是处在FocusNodeCollection中
   */
  public containsFocusNode(focusNode: FocusNode): boolean {
    let isContainsFocusNode: boolean = false;
    this.focusNodeCollection.forEach(focusNodeItem => {
      if (focusNodeItem.compare(focusNode)) {
        isContainsFocusNode = true;
      }
    });
    return isContainsFocusNode;
  }

  /**
   * 获取特定的FocusNode在FocusNodeCollection中的索引值
   */
  public indexOf(focusNode: FocusNode): number {
    let resultIndex: number = -1;
    this.focusNodeCollection.forEach((element, index) => {
      if (element.compare(focusNode)) {
        resultIndex = index;
      }
    });
    return resultIndex;
  }

  /**
   * 获取FocusNodeCollection中特定索引值的项
   */
  public getFocusNodeAt(index: number): FocusNode {
    return this.focusNodeCollection[index];
  }

  /**
   * 根据传入的 FocusNode 获取其在FocusNodeCollection 中的下一项
   */
  public getNextFocusNode(currentFocusNode: FocusNode): FocusNode | undefined {
    if (this.isLastFocusNode(currentFocusNode)) {
      return undefined;
    }
    const currentIndex: number = this.indexOf(currentFocusNode);
    if (currentIndex === -1) {
      // throw new FocusManagerParamError(`${currentFocusNode} Is Not In FocusNodeCollection`);
      return;
    }
    return this.focusNodeCollection[currentIndex + 1];
  }

  /**
   * 根据传入的 FocusNode 获取其在FocusNodeCollection 中的上一项
   */
  public getPrevFocusNode(currentFocusNode: FocusNode): FocusNode | undefined {
    if (this.isFirstFocusNode(currentFocusNode)) {
      return undefined;
    }

    const currentIndex: number = this.indexOf(currentFocusNode);
    if (currentIndex === -1) {
      throw new FocusManagerParamError(`${currentFocusNode} Is Not In FocusNodeCollection`);
    }

    return this.focusNodeCollection[currentIndex - 1];
  }

  /**
   * 获取一个元素真正的可获得焦点的父元素
   */
  public findRealElement(element: Element | Vue): FocusNode | undefined {
    let currentElement: Element | Vue | null = element;
    let realFocusableComponent: FocusNode | undefined;

    while (currentElement) {
      let currentFocusNode: FocusNode = new FocusNode(currentElement);
      // 如果包含 直接返回
      if (this.containsFocusNode(currentFocusNode)) {
        currentElement = null;
        return currentFocusNode;
        // 如果不包含且为HTMLElement且有__vue__且包含，返回
      } else if (isElementExtendsVueComponent(currentElement as HTMLElement)) {
        if (this.containsFocusNode(new FocusNode((currentElement as any).__vue__))) {
          currentFocusNode = new FocusNode((currentElement as any).__vue__);
          currentElement = null;
          return currentFocusNode;
        } else {
          currentElement = (currentElement as any).__vue__.$parent
        }
      } else {
        if (isObjectEqualVueIntance(currentElement as Element | Vue)) {
          currentElement = (currentElement as Vue).$parent;
        } else {
          if ((currentElement as HTMLElement).parentElement) {
            currentElement = (currentElement as HTMLElement).parentElement;
          } else {
            return undefined;
          }
        }
      }
    }
    return realFocusableComponent;

  }

  /**
   * 判断一个FocusNode是不是自我处理焦点
   */
  public isFocusNodeHandleInternally(focusNode: FocusNode): boolean {
    // tslint:disable-next-line: max-line-length
    const focusNodeTagName: string = isObjectEqualVueIntance(focusNode.component) ? (focusNode.component as any).$options._componentTag : (focusNode.component as HTMLElement).tagName.toLowerCase();
    const focusNodeConfig: ComponentConfig | undefined = this.componentConfigs.get(focusNodeTagName);
    if (!focusNodeConfig) {
      throw new FocusManagerParamError(`请先在config中配置${focusNodeConfig}`);
    }
    return focusNodeConfig.handleFocusInternally || false;
  }

  /**
   * 返回一个FocusNode的tagname
   */
  public getFocusNodeTagName(focusNode: FocusNode): HTMLElementTagName {
    if (isObjectEqualVueIntance(focusNode.component)) {
      return (focusNode.component as any).$options._componentTag as HTMLElementTagName;
    } else {
      return (focusNode.component as Element).tagName.toLowerCase();
    }
  }

  /**
   * 返回一个focusNode的Navigator
   */
  public getFocusNodeNavigator(focusNode: FocusNode): IComponentNavigator | undefined {
    const focusNodeConfig: ComponentConfig | undefined = this.componentConfigs.get(this.getFocusNodeTagName(focusNode));
    if (focusNodeConfig) {
      return focusNodeConfig.focusNavigator;
    }
    return undefined;
  }

  /**
   * 获取一个元素是不是可点击状态
   */
  public getFocusNodeClickable(focusNode: FocusNode): boolean {
    const focusNodeTagName: HTMLElementTagName = this.getFocusNodeTagName(focusNode);
    const focusNodeConfig: ComponentConfig | undefined = this.componentConfigs.get(focusNodeTagName);
    if (!focusNodeConfig) {
      throw new FocusManagerParamError(`${focusNodeConfig}组件没有配置项，请先配置`);
    }
    return focusNodeConfig.clickable;
  }

  getNodesBefore(focusNode: FocusNode, isContainsCurrent: boolean): FocusNode[] {
    const currentIndex: number = this.indexOf(focusNode);
    if (isContainsCurrent) {
      return this.focusNodeCollection.slice(0, currentIndex + 1);
    } else {
      return this.focusNodeCollection.slice(0, currentIndex);
    }
  }
  getNodesAfter(focusNode: FocusNode, isContainsCurrent: boolean): FocusNode[] {
    const currentIndex: number = this.indexOf(focusNode);
    if (isContainsCurrent) {
      return this.focusNodeCollection.slice(currentIndex);
    } else {
      return this.focusNodeCollection.slice(currentIndex + 1);
    }
  }
}