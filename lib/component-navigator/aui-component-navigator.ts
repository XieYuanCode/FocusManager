import IComponentNavigator from "../interface/icomponent-navigator";
import { FocusNode } from "../focus-node";
import KeyCode from "../enum/keyCode";

class AuiNumberInputNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }

}
class AuiButtonNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    switch (keyCode) {
      case KeyCode.Space:
        return true;
      default:
        return false;
    }
  }
}

class AuiCheckBoxNaviagtor implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiCounterInputNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }

}
class AuiDatePickerNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    switch (keyCode) {
      case KeyCode.ArrowLeft:
        return !!(target.component as any).date_box_visable;
      case KeyCode.ArrowDown:
        return !!(target.component as any).date_box_visable;
      case KeyCode.ArrowRight:
        return !!(target.component as any).date_box_visable;
      case KeyCode.ArrowUp:
        return !!(target.component as any).date_box_visable;
      case KeyCode.Space:
        return true;
      case KeyCode.Enter:
        return !!(target.component as any).date_box_visable
      default:
        return false;
    }
  }

}

class AuiPasswordNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiRadioNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    switch (keyCode) {
      case KeyCode.ArrowLeft:
        return true;
      case KeyCode.ArrowRight:
        return true;
      default:
        return false;
    }
  }
}

class AuiRadioGroupNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    switch (keyCode) {
      case KeyCode.ArrowLeft:
        return true;
      case KeyCode.ArrowRight:
        return true;
      default:
        return false;
    }
  }
}

class AuiCheckBoxGroupNaviagtor implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    switch (keyCode) {
      case KeyCode.ArrowLeft:
        return true;
      case KeyCode.ArrowRight:
        return true;
      case KeyCode.Space:
        return true;
      default:
        return false;
    }
  }
}

class AuiSelectNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    switch (keyCode) {
      case KeyCode.ArrowDown:
        return (target.component as any).isDropDownOpen;
      case KeyCode.ArrowUp:
        return (target.component as any).isDropDownOpen;
      case KeyCode.Enter || KeyCode.NumpadEnter:
        return (target.component as any).isDropDownOpen;
      case KeyCode.Space:
        return true;
      default:
        return false;
    }
  }
}

class AuiStepperNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiTabsNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiTableNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiTextNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiTextAreaNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    switch (keyCode) {
      case KeyCode.Enter:
        return true;
      case KeyCode.ArrowDown:
        return true;
      case KeyCode.ArrowLeft:
        return true;
      case KeyCode.ArrowRight:
        return true;
      case KeyCode.ArrowUp:
        return true;
      default:
        return false;
    }
  }
}

class AuiTextInputNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiTipNavigator implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}

class AuiCurrencyInput implements IComponentNavigator {
  handlesNavigationKey(target: FocusNode, keyCode: KeyCode): boolean {
    return false;
  }
}
export {
  AuiNumberInputNavigator,
  AuiButtonNavigator,
  AuiCheckBoxNaviagtor,
  AuiCounterInputNavigator,
  AuiDatePickerNavigator,
  AuiPasswordNavigator,
  AuiRadioNavigator,
  AuiRadioGroupNavigator,
  AuiSelectNavigator,
  AuiStepperNavigator,
  AuiTabsNavigator,
  AuiTableNavigator,
  AuiTextNavigator,
  AuiTextAreaNavigator,
  AuiTextInputNavigator,
  AuiTipNavigator,
  AuiCurrencyInput,
  AuiCheckBoxGroupNaviagtor
};