import Vue from "vue";


export default interface IFocusable {
  component: Element | Vue;

  elementTop: number

  elementLeft: number

  focus(): void;

  click(): void

  compare(focusNode: IFocusable): boolean
}