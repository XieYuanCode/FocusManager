import { FocusNode } from "../focus-node";
import KeyCode from "../enum/keyCode";

/**
 * 组件为WebComponent时，可以在Navigator中注册内部焦点逻辑
 */
export default interface IComponentNavigator {
    handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean;
}
