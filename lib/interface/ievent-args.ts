import IFocusable from "./ifocus-able";
import FocusTrigger from "../enum/focus-trigger";
import FocusDirection from "../enum/focus-direction";
import FocusEventType from "../enum/focus-event-type";
import FocusManager from "../focus-manager";
import FocusEventAsyncToken from "../focus-event-async-token";

export default interface IEventArgs {
  /**
     * 触发这次焦点事件的原因
     */
    focusTrigger: FocusTrigger;

    /**
     * 即将获得焦点的元素
     */
    newFocus: IFocusable | undefined;

    /**
     * 当前获得焦点的元素
     */
    oldFocus: IFocusable | undefined;

    /**
     * 该次焦点移动的方向
     */
    direction: FocusDirection;

    /**
     * 标识该事件轮回将由被异步完成
     */
    willCompleteAsync: boolean;

    /**
     * 是否标记为处理已完成
     */
    isMarkedCompleted: boolean;

    /**
     * 当前focusEvent类型
     */
    focusEventType: FocusEventType;

    /**
     * focusManager
     */
    focusManager: FocusManager;

    beginAsync(): FocusEventAsyncToken

}