import FocusTrigger from "./enum/focus-trigger";
import { FocusNode } from "./focus-node";
import FocusDirection from "./enum/focus-direction";
import FocusEventType from "./enum/focus-event-type";
import FocusManager from "./focus-manager";
import FocusEventAsyncToken from "./focus-event-async-token";

class FocusEventArgs {
  /**
   * 触发这次焦点事件的原因
   */
  focusTrigger: FocusTrigger;

  /**
   * 即将获得焦点的元素
   */
  newFocus: FocusNode | undefined;

  /**
   * 当前获得焦点的元素
   */
  oldFocus: FocusNode | undefined;

  /**
   * 该次焦点移动的方向
   */
  direction: FocusDirection;

  /**
   * 标识该事件轮回将由被异步完成
   */
  willCompleteAsync: boolean = false;

  /**
   * 是否标记为处理已完成
   */
  isMarkedCompleted: boolean = false;

  /**
   * 当前focusEvent类型
   */
  focusEventType: FocusEventType;

  /**
   * focusManager
   */
  focusManager: FocusManager;

  asyncCounter: 0

  // tslint:disable-next-line: max-line-length
  constructor(oldFocus: FocusNode | undefined, newFocus: FocusNode | undefined, direction: FocusDirection, focusTrigger: FocusTrigger, focusEventType: FocusEventType, focusManager: FocusManager) {
    this.oldFocus = oldFocus;
    this.newFocus = newFocus;
    this.direction = direction;
    this.focusTrigger = focusTrigger;
    this.focusEventType = focusEventType;
    this.focusManager = focusManager;
  }

  beginAsync(): FocusEventAsyncToken {
    this.willCompleteAsync = true;
    this.asyncCounter++
    // const diabledFocusNodeCollection: Array<FocusNode> = this.focusManager.focusList.disableAllFocusNodes();
    return new FocusEventAsyncToken(this);
  }
}

export default FocusEventArgs;