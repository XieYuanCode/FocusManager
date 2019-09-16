import { VueConstructor } from "vue";

/**
 * 注册了Vue插件
 * 实现outfocus功能
 * TODO:
 * 1. 注册后添加到xxx管理器
 * 2. 遍历焦点树的时候根据xxx管理器重新筛选
 */
export default {
  install(vue: VueConstructor): void {
    vue.directive("outfocus", {
      bind(el: HTMLElement): void {
        el.setAttribute("data-outfocus", "true");
      }
    });
  }
};