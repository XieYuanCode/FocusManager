import FocusEventArgs from "./focus-event-args";
import FocusEventType from "./enum/focus-event-type";
import { Dispatcher } from "awp-ui-common";

class FocusEventAsyncToken {

  focusEventArgs: FocusEventArgs;

  // diabledFocusNodeCollection: Array<FocusNode>;

  constructor(focusEventArgs: FocusEventArgs) {
    this.focusEventArgs = focusEventArgs;
    // this.diabledFocusNodeCollection = diabledFocusNodeCollection;
  }

  /**
   * 标识异步动作完成
   */
  asyncComplate(): void {
    this.focusEventArgs.isMarkedCompleted = true;
    this.focusEventArgs.asyncCounter--

    if(this.focusEventArgs.asyncCounter > 0) {
      return;
    }
    // this.focusEventArgs.focusManager.focusList.enableAllFocusNodes(this.diabledFocusNodeCollection);

    switch (this.focusEventArgs.focusEventType) {
      case FocusEventType.PreviewGotFocus:
        Dispatcher.current.beginInvoke(() => { this.focusEventArgs.focusManager.endPreviewGotFocus(this.focusEventArgs); });
        break;
      case FocusEventType.GotFocus:
        Dispatcher.current.beginInvoke(() => { this.focusEventArgs.focusManager.endGotFocus(this.focusEventArgs); });
        break;
      case FocusEventType.PreviewLostFocus:
        Dispatcher.current.beginInvoke(() => { this.focusEventArgs.focusManager.endPreviewLostFoucs(this.focusEventArgs); });
        break;
      case FocusEventType.LostFocus:
        Dispatcher.current.beginInvoke(() => { this.focusEventArgs.focusManager.endLostFocus(this.focusEventArgs); });
        break;
    }
  }
}

export default FocusEventAsyncToken;