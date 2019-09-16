import Vue from "vue";
import { isObjectEqualVueIntance } from "./is-vue";
import IFocusable from './interface/ifocus-able';
import FocusManager from "./focus-manager"
import { Dispatcher } from "awp-ui-common";

class FocusNode implements IFocusable {
  readonly component: Element | Vue;
  readonly elementTop: number;
  readonly elementLeft: number;

  constructor(node: Element | Vue) {
    this.component = node;

    const realHTMLNode: Element = isObjectEqualVueIntance(this.component) ? (this.component as Vue).$el : this.component as Element;

    // tslint:disable-next-line: max-line-length
    this.elementTop = realHTMLNode.getBoundingClientRect().top + realHTMLNode.scrollTop + parseInt(getComputedStyle(realHTMLNode).height as string, 10) / 2;
    // tslint:disable-next-line: max-line-length
    this.elementLeft = realHTMLNode.getBoundingClientRect().left + realHTMLNode.scrollLeft + parseInt(getComputedStyle(realHTMLNode).width as string, 10) / 2;
  }
  focus(): void {
    if (isObjectEqualVueIntance(this.component)) {
      Dispatcher.current.beginInvoke(() => {
        if( (this.component as any).focus && (typeof (this.component as any).focus === "function")) {
          (this.component as any).focus();
        }
      })
    } else {
      Dispatcher.current.beginInvoke(() => {
        (this.component as HTMLElement).focus();
      })
    }
  }
  click(): void {
    if (isObjectEqualVueIntance(this.component)) {
      if( (this.component as any).$click && (typeof (this.component as any).$click === "function")) {
        (this.component as any).$click()
      }
    } else {
      (this.component as HTMLElement).click();
    }
  }
  compare(focusNode: FocusNode): boolean {
    if(!focusNode) {
      return false;
    } else {
      return focusNode.component === this.component;
    }
  }
}

export { FocusNode };