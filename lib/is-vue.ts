import { FocusManagerParamError } from "./error/error";
import Vue from "vue";

// 判断一个对象是不是一个vue实例
const isObjectEqualVueIntance = (object: Element | HTMLElement | Vue) => {
  if (!object) {
    throw new FocusManagerParamError("object in null");
  }
  return !!((object as any)._isVue);

};

// 判断一个HTML元素是不是VueComponent
const isElementExtendsVueComponent = (element: HTMLElement) => {
  if (!element) {
    throw new FocusManagerParamError("object in null");
  }
  return !!((element as any).__vue__);
};

export {
  isObjectEqualVueIntance,
  isElementExtendsVueComponent
};