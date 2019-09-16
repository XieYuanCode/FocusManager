import FocusManager from "./lib/focus-manager";

// interface
import IComponentNavigator from "./lib/interface/icomponent-navigator";
import IComponentSelector from "./lib/interface/icomponent-selector";
import IFocusable from "./lib/interface/ifocus-able";
import IFocusList from "./lib/interface/ifocus-list";

// enum
import FocusDirection from "./lib/enum/focus-direction";
import FocusEventType from "./lib/enum/focus-event-type";
import FocusTrigger from "./lib/enum/focus-trigger";
import KeyCode from "./lib/enum/keyCode";

// directives
import OutFocus from "./lib/directives/out-focus";

// class
import ComponentConfig from "./lib/component-config/component-config";
import CompatibleConfig from "./lib/compatible-config";
import FocusManagerOptions from "./lib/focus-manager-options";
import { FocusNode } from "./lib/focus-node";

export default FocusManager;

export {
  // interface
  IComponentNavigator,
  IComponentSelector,
  IFocusable,
  IFocusList,

  // enum
  FocusDirection,
  FocusEventType,
  FocusTrigger,
  KeyCode,

  // directives
  OutFocus,

  // class
  ComponentConfig,
  CompatibleConfig,
  FocusManagerOptions,
  FocusNode
};