import KeyCode from "./enum/keyCode";

export default {
    /**
     * 是否前往下一个可用元素
     */
    isGoNextAvailableFocusNode: (keyboardEvent: KeyboardEvent) => {
        // tslint:disable-next-line: max-line-length
        let goNext=false;
        if(keyboardEvent.code === KeyCode.Enter || keyboardEvent.key === KeyCode.NumpadEnter){
          goNext=true;
          keyboardEvent.preventDefault();
        }

        return goNext;
    },
    /**
     * 是否返回上一个可用元素
     */
    isGoLastAvailableFocusNode: (keyboardEvent: KeyboardEvent) => {
        return keyboardEvent.code === KeyCode.ArrowUp || keyboardEvent.key === KeyCode.NumpadAdd;
    },

    /**
     * 是否触发点击事件点击
     */
    isTriggerClickEvent: (keyboardEvent: KeyboardEvent) => {
        return keyboardEvent.code === KeyCode.Space;
     }
};