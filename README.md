# FocusManager Api 以及说明文档

[TOC]

---

## 安装

1. 下载
```bash
abyarn add awp-ui-focus-manager-ts awp-ui-vue-assets
```

2. 引入

```javascript
// 焦点控制
import FocusManager from "awp-ui-focus-manager-ts";
// Vue调度器
import VueDispatcher from "awp-ui-vue-assets";
```
---

## 入门使用

### 1. 初始化

> <a href="#FocusManager">FocusManager</a>.configure(focusManagerOptions: <a href="#FocusManagerOptions">`FocusManagerOptions`</a>);
```javascript
// expample
FocusManager.configure({
  dispatcher: VueDispatcher,
  isAutoFocusFirstNode: true
});
```
<a href="#FocusManager">`FocusManager`</a>
<a href="#FocusManagerOptions">`FocusManagerOptions`</a>


### 2. 在特定域添加焦点控制

> <a href="#FocusManager">FocusManager</a>.attach(element: `Vue` | `Element`): `void`
```javascript
// 在页面dom渲染完之后触发FocusManager的attach()方法
// Vue Example
mounted() {
    // 定义一个受到焦点管理的域
    // 可以是Element原生元素或者是Vue实例
    // 如果是this，就是当前SFC
    const focusScope = this
    // 让焦点控制管理当前域
    FocusManager.attach(focusScope)
}
```

### 3. 移除特定域的焦点控制

> <a href="#FocusManager">FocusManager</a>.detach(element: `Vue` | `Element`): `void`
```javascript
// 在页面即将销毁的时候触发FocusManager的detach()方法
// Vue Example
beforeDestory() {
    // 定义一个受到焦点管理的域
    // 可以是Element原生元素或者是Vue实例
    // 如果是this，就是当前SFC
    const focusScope = this
    // 让焦点控制移除管理域的管理
    FocusManager.attach(focusScope)
}
```
---

## Api

### <span id="FocusManager">**FocusManager**</span>(class)

#### *-static methods*

##### **configure**(focusManagerOptions: <a href="#FocusManagerOptions">`FocusManagerOptions`</a>): `void`
配置焦点管理器全局属性
在程序入口处调用

##### **getCurrentComponentConfig**(): Map< <a href="#HTMLElementTagName">`HTMLElementTagName`</a>, <a href="#ComponentConfig">`ComponentConfig`</a> >
获取当前项目的组件配置

##### **setComponentConfig**(componentConfig: <a href="#ComponentConfig">`ComponentConfig`</a> | Map< <a href="#HTMLElementTagName">`HTMLElementTagName`</a>, <a href="#ComponentConfig">`ComponentConfig`</a> >): `void`
新增自定义或配置当前修改组件配置

##### **attach**(root: `Element` | `Vue`): `void`
在特定域添加焦点控制

##### **detach**(root: `Element` | `Vue`): `void`
移除特定域的焦点控制

##### ~~**dettach**(): `void`~~(***弃用***)
为兼容旧版的焦点控制而声明的方法

##### **getAttachedFocusManager**(element:  `Element` | `Vue`): <a href="#FocusManager">`FocusManager`</a> | `undefined`
获取一个element对应的焦点管理器

### <span id="FocusManagerOptions">**FocusManagerOptions**</span>(class)

#### *-properties*

##### **dispatcher**:<a href="#IDispatcher">`IDispatcher`</a>(可选)
调度器
Vue项目中可以使用`awp-ui-vue-assets`中提供的`VueDispatcher`模块

##### **focusList**: (el: `Element` | `Vue`) => <a href="#IFocusList">`IFocusList`</a>(可选)
遍历目录树的算法

##### **compatibleConfig**: <a href="#CompatibleConfig">`CompatibleConfig`</a>(可选)
兼容旧版焦点控制相关配置项

##### **continuousJump**: `boolean`(可选)
是否连续跳跃标识

##### **isAutoFocusFirstNode**: `boolean`(可选)
页面加载后当前scoped中的第一个元素是否自动获取焦点

### <span id="HTMLElementTagName">**HTMLElementTagName**</span>: `string`(type)

### <span id="ComponentConfig">**ComponentConfig**</span>

#### *-properties*

##### **elementTagName**: <a href="#HTMLElementTagName">`HTMLElementTagName`</a>
组件标签名

##### **focusable**: `boolean`
组件是否可以获得焦点

##### **clickable**: `boolean`
组件是否可以点击

##### **autoFocus**: `boolean`
组件是否可以自动获得焦点

##### **isProtogeneticElement**: `boolean`
组件是否为HTML原生组件

##### **focusNavigator**: <a href="#IComponentNavigator">`IComponentNavigator`</a>(可选)
当组件为WebComponent时，可以在Navigator添加内部焦点逻辑
用于判断何时焦点由组件自己处理

##### **handleFocusInternally**: `boolean`(可选)
当组件为webComponent时,用来标识自我处理焦点
在Vue文件中，需要在methods中声明$focus()的方法用来处理自己的焦点

### <span id="IDespatcher">**IDespatcher**</span>(interface)
#### *-methods*

##### beginInvoke(cb:`Function`):`void`

### <span id="IFocusList">**IFocusList**</span>(interface)
#### *-properties*

##### **root**: `Element` | `Vue`
当前域根节点

##### **componentConfigs**: Map<<a href="#HTMLElementTagName">`HTMLElementTagName`</a>, <a href="#ComponentConfig">`ComponentConfig`</a>>
组件配置

##### **focusNodeCollection**: Array<<a href="#FocusNode">`FocusNode`</a>>
焦点元素集合

#### *-methdos*

##### **updateFocusNodeCollection**(element: `Element` | `Vue`):`void`
更新当前焦点元素集合

##### **sortFocusNodeCollectionByPosition**():`void`
根据视觉相对位置, 整理当前的focusNodeCollection

##### **disableAllFocusNodes**():Array<<a href="#FocusNode">`FocusNode`</a>>
禁用当前所有未禁用的FocusNode
返回一个禁用列表

##### **enableAllFocusNodes**(focusNodeCollection:Array<<a href="#FocusNode">`FocusNode`</a>>):`void`
将传入的focusNode集合中的元素启用

##### **getNextFocusNode**(currentFocusNode: <a href="#FocusNode">`FocusNode`</a>): <a href="#FocusNode">`FocusNode`</a> | `undefined`
根据传入的 FocusNode 获取其在FocusNodeCollection 中的下一项

##### **getPrevFocusNode**(currentFocusNode: <a href="#FocusNode">`FocusNode`</a>): <a href="#FocusNode">`FocusNode`</a> | `undefined`
根据传入的 FocusNode 获取其在FocusNodeCollection 中的上一项

##### **findRealElement**(element: `Element` | `Vue`): <a href="#FocusNode">`FocusNode`</a> | `undefined`
获取一个元素真正的可获得焦点的父元素

##### **getDirection**(firstFocusNode:<a href="#FocusNode">`FocusNode`</a>, secondFocusNode:<a href="#FocusNode">`FocusNode`</a>): <a href="#FocusDirection">`FocusDirection`</a>
判断传入的两个元素的Direction

##### **containsFocusNode**(focusNode: <a href="#FocusNode">`FocusNode`</a>): `boolean`
判断特定的FocusNode是不是处在FocusNodeCollection中

##### **isFocusNodeHandleInternally**(focusNode: <a href="#FocusNode">`FocusNode`</a>): `boolean`
判断一个FocusNode是不是自我处理焦点

##### **getFocusNodeTagName**(focusNode: <a href="#FocusNode">`FocusNode`</a>): <a href="#HTMLElementTagName">`HTMLElementTagName`</a>
返回一个FocusNode的tagname

##### **getFocusNodeNavigator**(focusNode: <a href="#FocusNode">`FocusNode`</a>): <a href="#IComponentNavigator">`IComponentNavigator`</a> | `undefined`
返回一个focusNode的Navigator

##### **getFocusNodeAt**(index: `number`): <a href="#FocusNode">`FocusNode`</a>
获取FocusNodeCollection中特定索引值的项

##### **getFocusNodeClickable**(focusNode:  <a href="#FocusNode">`FocusNode`</a>): `boolean`
获取一个focusNode的clickable属性

##### **isLastFocusNode**(focusNode:  <a href="#FocusNode">`FocusNode`</a>): `boolean`
判断特定FocusNode是不是FocusNodeCollection的最后一项

##### **isFirstFocusNode**(focusNode:  <a href="#FocusNode">`FocusNode`</a>): `boolean`
判断特定FocusNode是不是FocusNodeCollection的第一项

##### **refresh**(): `void`
刷新当前 focusNodeCollection







