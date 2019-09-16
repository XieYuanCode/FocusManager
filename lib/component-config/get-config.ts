import { FocusManagerConfigError } from "../error/error";
import ComponentConfig from "./component-config";
import Config from "./config";
import { HTMLElementTagName } from "./HTML-element-tag-name";

type componentsConfig = Map<HTMLElementTagName, ComponentConfig>;

class ComponentConfigManager {
  private _userComponentConfig: ComponentConfig | Map<HTMLElementTagName, ComponentConfig> | undefined;

  public getComponentsConfig(): componentsConfig {
    let combineConfig: Map<string, ComponentConfig> = new Map<string, ComponentConfig>();
    Config.forEach(nodeConfig => {
      if (!nodeConfig.elementTagName) {
        throw new FocusManagerConfigError(`Please Make Sure Each Component'Config Has Prototype: 'elementTagName'`);
      }
      combineConfig.set(nodeConfig.elementTagName, nodeConfig);
    });
    if (this._userComponentConfig) {
      if (this._userComponentConfig instanceof ComponentConfig) {
        combineConfig.set(this._userComponentConfig.elementTagName, this._userComponentConfig);
      } else {
        this._userComponentConfig.forEach(element => {
          combineConfig.set(element.elementTagName, element);
        });
      }
    }
    return combineConfig;
  }

  public setComponentConfig(userComponentConfig?: ComponentConfig | Map<HTMLElementTagName, ComponentConfig>): void {
    this._userComponentConfig = userComponentConfig;
  }
}

export default new ComponentConfigManager();

