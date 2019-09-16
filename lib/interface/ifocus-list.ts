import { FocusNode } from "../focus-node";
import { HTMLElementTagName } from "../component-config/HTML-element-tag-name";
import ComponentConfig from "../component-config/component-config";
import FocusDirection from "../enum/focus-direction";
import Vue from "vue";
import IComponentNavigator from "./icomponent-navigator";

export default interface IFocusList {

  /**
   * 根节点
   */
  root: Element | Vue;

  /**
   * 组件配置
   */
  componentConfigs: Map<HTMLElementTagName, ComponentConfig>;

  /**
   * 焦点focusNode集合
   */
  focusNodeCollection: Array<FocusNode>;

  /**
   * 更新当前焦点focusNode集合
   */
  updateFocusNodeCollection(element: Element | Vue): void;

  /**
   * 按照视觉顺序整理排布当前焦点focusNode集合
   */
  sortFocusNodeCollectionByPosition(): void;

  /**
   * 禁用所有focusNode
   */
  disableAllFocusNodes(): Array<FocusNode>;

  /**
   * 启用传入的所有focusNode
   * @param focusNodeCollection 需要启动的focusNode结合，一般为disableAllFocusNodes的返回值
   */
  enableAllFocusNodes(focusNodeCollection: Array<FocusNode>): void;

  /**
   * 获得下一个焦点focusNode
   * @param currentFocusNode 当前焦点focusNode
   */
  getNextFocusNode(currentFocusNode: FocusNode): FocusNode | undefined;

  /**
   * 获得上一个焦点focusNode
   * @param currentFocusNode 当前焦点focusNode
   */
  getPrevFocusNode(currentFocusNode: FocusNode): FocusNode | undefined;

  /**
   * 获得一个focusNode的真实的在焦点管理列表中的focusNode
   * @param element 要判断的focusNode
   */
  findRealElement(element: Element | Vue): FocusNode | undefined;

  /**
   * 获得焦点移动的方向
   * @param firstFocusableNode 第一个focusNode
   * @param secodFocusableNode 第二个focusNode
   */
  getDirection(firstFocusableNode: FocusNode, secodFocusableNode: FocusNode | undefined): FocusDirection;

  /**
   * 判断特定的FocusNode是不是处在FocusNodeCollection中
   * @param element 要判断的focusNode
   */
  containsFocusNode(element: FocusNode): boolean;

  /**
   * 判断一个focusNode是不是自我处理的的focusNode
   * @param focusNode 要判断的focusNode
   */
  isFocusNodeHandleInternally(focusNode: FocusNode): boolean;

  /**
   * 获得一个focusNode的tagName
   * @param focusNode 要判断的focusNode
   */
  getFocusNodeTagName(focusNode: FocusNode): HTMLElementTagName;

  /**
   * 获得一个focusNode的ComponentNavigator
   * @param focusNode 要获取的focusNode
   */
  getFocusNodeNavigator(focusNode: FocusNode): IComponentNavigator | undefined;

  /**
   * 获得焦点列表中特定索引的focusNode
   * @param index 索引
   */
  getFocusNodeAt(index: number): FocusNode;

  /**
   * 判断一个focusNode是不是可点击状态的
   * @param focusNode 要判断的focusNode
   */
  getFocusNodeClickable(focusNode: FocusNode): boolean;

  /**
   * 判断一个focusNode是不是焦点列表最后一个focusNode
   * @param focusNode 要判断的focusNode
   */
  isLastFocusNode(focusNode: FocusNode): boolean;

  /**
   * 判断一个focusNode是不是焦点列表第一个focusNode
   * @param focusNode 要判断的focusNode
   */
  isFirstFocusNode(focusNode: FocusNode): boolean;

  /**
   * 获得一个focusNode在焦点列表中之前的每一个focusNode
   * @param {FocusNode} focusNode 当前focusNode
   * @param {boolean} isContainsCurrent 是否包含自己
   */
  getNodesBefore(focusNode: FocusNode, isContainsCurrent: boolean): Array<FocusNode>;

  /**
   * 获得一个focusNode在焦点列表中之后的每一个focusNode
   * @param {FocusNode} focusNode 当前focusNode
   * @param {boolean} isContainsCurrent 是否包含自己
   */
  getNodesAfter(focusNode: FocusNode, isContainsCurrent: boolean): Array<FocusNode>;
  /**
   * 获得一个特定focusNode在焦点列表中的索引
   * @param focusNode 要判断的focusNode
   */
  indexOf(focusNode: FocusNode): number;

  /**
   * 刷新当前焦点列表
   */
  refresh(): void;
}

