import ComponentConfig from "./component-config";
import {
  AuiNumberInputNavigator,
  AuiButtonNavigator,
  AuiCheckBoxNaviagtor,
  AuiCounterInputNavigator,
  AuiPasswordNavigator,
  AuiRadioNavigator,
  AuiSelectNavigator,
  AuiStepperNavigator,
  AuiTabsNavigator,
  AuiTableNavigator,
  AuiTextNavigator,
  AuiTipNavigator,
  AuiTextAreaNavigator,
  AuiCurrencyInput,
  AuiRadioGroupNavigator,
  AuiCheckBoxGroupNaviagtor,
  AuiDatePickerNavigator
} from "../component-navigator/aui-component-navigator";

/**
 * 组件配置
 */
const config: Array<ComponentConfig> = [
  //#region  原生元素
  // button
  {
    elementTagName: "button",
    focusable: true,
    clickable: true,
    autoFocus: true,
    isProtogeneticElement: true
  },
  // input
  {
    elementTagName: "input",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: true
  },
  // select
  {
    elementTagName: "select",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: true
  },
  // option(select_item)
  {
    elementTagName: "option",
    focusable: true,
    clickable: false,
    autoFocus: false,
    isProtogeneticElement: true
  },
  // textarea
  {
    elementTagName: "textarea",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: true
  },
  //#endregion
  // aui-number-input
  {
    elementTagName: "aui-number-input",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiNumberInputNavigator()
  },
  // aui-button
  {
    elementTagName: "aui-button",
    focusable: true,
    clickable: true,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiButtonNavigator()
  },
  {
    elementTagName: "aui-checkbox",
    focusable: true,
    autoFocus: true,
    clickable: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiCheckBoxNaviagtor()
  },
  {
    elementTagName: "aui-checkbox-group",
    focusable: true,
    autoFocus: true,
    clickable: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiCheckBoxGroupNaviagtor()
  },
  {
    elementTagName: "aui-counter-input",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiCounterInputNavigator()
  },
  {
    elementTagName: "aui-date-picker",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiDatePickerNavigator()
  },
  {
    elementTagName: "aui-passwrod",
    focusable: true,
    clickable: false,
    autoFocus: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiPasswordNavigator()
  },
  {
    elementTagName: "aui-radio",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiRadioNavigator()
  },
  {
    elementTagName: "aui-radio-group",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiRadioGroupNavigator()
  },
  {
    elementTagName: "aui-select",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiSelectNavigator(),
  },
  {
    elementTagName: "aui-stepper",
    focusable: true,
    clickable: false,
    autoFocus: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiStepperNavigator(),
  },
  {
    elementTagName: "aui-tabs",
    focusable: true,
    clickable: false,
    autoFocus: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiTabsNavigator(),
  },
  {
    elementTagName: "aui-table",
    focusable: true,
    clickable: false,
    autoFocus: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiTableNavigator(),
  },
  {
    elementTagName: "aui-text",
    focusable: true,
    clickable: false,
    autoFocus: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiTextNavigator(),
  },
  {
    elementTagName: "aui-text-area",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiTextAreaNavigator(),
  },
  {
    elementTagName: "aui-text-input",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiTextNavigator(),
  },
  {
    elementTagName: "aui-tip",
    focusable: true,
    clickable: false,
    autoFocus: false,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiTipNavigator(),
  },
  {
    elementTagName: "aui-currency-input",
    focusable: true,
    clickable: false,
    autoFocus: true,
    isProtogeneticElement: false,
    handleFocusInternally: true,
    focusNavigator: new AuiCurrencyInput(),
  },
];

export default config;
