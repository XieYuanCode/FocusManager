import { HTMLElementTagName } from "../component-config/HTML-element-tag-name";
import Vue from "vue";

export default interface IComponentSelector {
  isComponentAvailable(tagNameCollection: Array<HTMLElementTagName>, element: Element | Vue): boolean;
}