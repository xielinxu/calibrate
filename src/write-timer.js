// 最大操作时间间隔(毫秒)
const MAX_OPERATION_GAP = 1000
const MIN_OPERATION_GAP = 15
const OPERATION_GAP = 50

function ConstantTimer() {
  this.gap = 50
}

ConstantTimer.prototype.succeed = function(){
}
ConstantTimer.prototype.failed = function(){
}
ConstantTimer.prototype.nextGap = function(){
  return this.gap
}


// 不能发送太快导致设备处理不过来。写入间隔动态计算，失败次数越多，发送间隔时间越长。
function VelocityTimer() {
  this.gap = OPERATION_GAP
  this.totalFailedTimes = 0
  this.successTimes = 0
  this.failedTimes = 0
  this.gradient = 5

  // 15ms 最小间隔这个是经验值
  this.lastFailedGap = 14.9
}

VelocityTimer.prototype.succeed = function() {
  if(this.failedTimes != 0) {
  	this.failedTimes = 0
  }

  this.successTimes += 1
  
  // 成功写入减小 gap， 以加快写入速度。但是不能小于上一次失败的间隔。
  if(this.gap - this.gradient > this.lastFailedGap) {
    this.gap -= this.gradient
  }
}

VelocityTimer.prototype.failed = function() {
  this.totalFailedTimes += 1
  if(this.successTimes != 0) {
  	this.successTimes = 0
  }
  this.failedTimes += 1

  this.lastFailedGap = this.gap
  var newGap = OPERATION_GAP + this.totalFailedTimes * 20
  this.gap = Math.min(MAX_OPERATION_GAP, newGap)
}

VelocityTimer.prototype.nextGap = function() {
  return this.gap
}

module.exports = {
  ConstantTimer: ConstantTimer,
  VelocityTimer: VelocityTimer, 
}