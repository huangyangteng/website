/* eslint-disable */

/**
 * rem 相关的工具
 * @param {*}  
 */
export function rem(){
  // 基准大小
  var baseSize = 16;
  // 设置 rem 函数
  function setRem() {
    // 当前页面宽度相对于 420 宽的缩放比例，可根据自己需要修改。
    var scale = document.documentElement.clientWidth / 420;
    // 设置页面根节点字体大小
    document.documentElement.style.fontSize = (baseSize * Math.min(scale, 8)) + 'px'
  }
  // 初始化
  setRem();
  // 改变窗口大小时重新设置rem
  window.onresize = function () {
    setRem()
  }
  console.log(document.documentElement.style.fontSize)
}
  // (function () {
  //   // 基准大小
  //   var baseSize = 16;
  //   // 设置 rem 函数
  //   function setRem() {
  //     // 当前页面宽度相对于 420 宽的缩放比例，可根据自己需要修改。
  //     var scale = document.documentElement.clientWidth / 420;
  //     // 设置页面根节点字体大小
  //     document.documentElement.style.fontSize = (baseSize * Math.min(scale, 8)) + 'px'
  //   }
  //   // 初始化
  //   setRem();
  //   // 改变窗口大小时重新设置rem
  //   window.onresize = function () {
  //     setRem()
  //   }
  //   console.log(document.documentElement.style.fontSize)
  // }());

/**
 * 删除html上的行内style
 */
export function removeAttributeOfHtml(){
  const docEl = document.documentElement;
  if(!docEl) return;
  docEl.removeAttribute('style');
}

/**
 * viewport的宽度是否比某个值大
 * @param {*} width 
 */
export function isWider(width){
  const viewPortSize = getViewportSize();
  if(viewPortSize.width>width){
    return true;
  }
  return false;
}

/**
 * 获取viewport的宽高
 */
export function getViewportSize () {
  return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
}

/**
 * 设置样式
 * @param {*} href 
 */
export function setLink(className) {
  let heads = document.getElementsByTagName('head');
  let htmlTags = document.getElementsByTagName('html');
  let htmlTag = htmlTags ? htmlTags[0] : null;
  htmlTag.setAttribute('class',className);
}

/**
 * 节流函数，你懂的。
 */
export function throttle(action,delay){
  let timeout = null;
  let lastRun = 0 ;
  return function(){
    if(timeout) return;
    let elapsed = Date.now()- lastRun
    let context = this;
    let args = arguments;
    let runCallback = function(){
      lastRun = Date.now();
      timeout = false;
      action.apply(context,args);
    }
    if(elapsed>=delay){
      runCallback();
    } else {
      timeout = setTimeout(runCallback,delay);
    }
  }
}