/**
 * 设置一个阀值，在阀值内，把触发的事件合并成一次执行；当到达阀值，必定执行一次事件
 */
export function throttle(action, delay) {
    var statTime = 0
  
    return function() {
      var currTime = +new Date()
  
      if (currTime - statTime > delay) {
        action.apply(this, arguments)
        statTime = currTime
      }
    }
}

/**
 * 设置一个阀值，在阀值内，每次action触发都会重置计时
 */
export function debounce(action, delay) {
    var timer = null;
    
    return function() {
        var self = this, 
              args = arguments;
              
        clearTimeout(timer);
        timer = setTimeout(function() {
            action.apply(self, args)
        }, delay);
    }
}