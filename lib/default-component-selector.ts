import IComponentSelector from "./interface/icomponent-selector";
import { isObjectEqualVueIntance } from "./is-vue";
import { HTMLElementTagName } from "./component-config/HTML-element-tag-name";
import Vue from "vue";

/**
 * 默认的组件选择器
 */
class DefaultComponentSelector implements IComponentSelector {
  /**
   * 传入的组件在传入的规则下是否可用
   */
  isComponentAvailable(tagNameCollection: Array<HTMLElementTagName>, element: Element | Vue): boolean {
    if (isObjectEqualVueIntance(element)) {
      // tslint:disable-next-line: max-line-length
      return tagNameCollection.includes((element as any).$options._componentTag) &&
        !(element as any).disabled &&
        !(element as Vue).$el.hasAttribute("data-outfocus") &&
        ((element as Vue).$el as HTMLElement).style.display !== "none"
        && ((element as any).enable !== false);
    } else {
      if ((element as HTMLElement).tagName === void 0) {
        return false;
      }
      // tslint:disable-next-line: max-line-lengthincludes
      return tagNameCollection.includes((element as HTMLElement).tagName.toLowerCase()) &&
        !(element as HTMLElement).hasAttribute("disabled") &&
        !(element as HTMLElement).hasAttribute("data-outfocus") &&
        (element as HTMLElement).style.display !== "none";
    }
  }
}
export default DefaultComponentSelector;