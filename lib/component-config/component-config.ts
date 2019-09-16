import IComponentNavigator from "../interface/icomponent-navigator";
import { HTMLElementTagName } from "./HTML-element-tag-name";

/**
 * 组件配置数据结构
 */
class ComponentConfig {
  /**
   * 组件标签名
   */
  elementTagName: HTMLElementTagName;

  /**
   * 组件是否可以获得焦点
   */
  focusable: boolean;

  /**
   * 组件是否可以点击
   */
  clickable: boolean;

  /**
   * 组件是否可以自动获得焦点
   */
  autoFocus: boolean;

  /**
   * 组件是否为HTML原生组件
   */
  isProtogeneticElement: boolean;

  /**
   * 当组件为WebComponent时，可以在Navigator添加内部焦点逻辑
   */
  focusNavigator?: IComponentNavigator;

  /**
   * 当组件为webComponent时,用来标识自我处理焦点
   * 在Vue文件中，需要在methods中声明$focus()的方法用来处理自己的焦点
   */
  handleFocusInternally?: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(elementTagName: HTMLElementTagName, focusable: boolean, clickable: boolean, autoFocus: boolean, isProtogeneticElement: boolean, focusNavigator?: IComponentNavigator, handleFocusInternally?: boolean) {
    this.elementTagName = elementTagName;
    this.focusable = focusable;
    this.clickable = clickable;
    this.autoFocus = autoFocus;
    this.isProtogeneticElement = isProtogeneticElement;
    this.focusNavigator = focusNavigator;
    this.handleFocusInternally = handleFocusInternally;
  }
}

export default ComponentConfig;