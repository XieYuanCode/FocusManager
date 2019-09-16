import Vue from "vue";
import CompatibleConfig from "./compatible-config";
import IFocusList from "./interface/ifocus-list";
import { HTMLElementTagName } from "./component-config/HTML-element-tag-name";
import IComponentNavigator from "./interface/icomponent-navigator";
import { IDispatcher } from "awp-ui-common";

export default class FocusManagerOptions {
  public dispatcher?: IDispatcher;
  public focusList?: (el: Element | Vue) => IFocusList;
  public compatibleConfig?: CompatibleConfig;
  public continuousJump?: boolean;
  public isAutoFocusFirstNode?: boolean;
  public navigators?: Map<HTMLElementTagName, IComponentNavigator>;
}