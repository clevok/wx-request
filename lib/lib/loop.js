"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 消息队列, 指定队列长度
 * 消息队列是发射器, 把水滴 射到 马桶
 * 马桶是个处理器, 有个洞, 流出水, 这个洞叫 消费者
 * 队列长度指, 我发射器虽然要发, 但是得控制 马桶里 最多 10个水滴
 *
 *
 * loop传入方法 触发 消费者 从 发射器中 拿来一个方法到马桶池中 执行, 前提是 马桶池中 水滴 < 限制
 *
 * loop传入方法, (next) => {
 *  next() 表示该方法完结, 表示从 马桶池里 消耗掉一个方法
 *  此时应该触发 消费者 再尝试 从发射器中 取出 一个 方法, 如果发射器没有方法就结束
 * }
 *
 *
 *
 * 感觉上面的太复杂了
 * 方案 2 (采纳)
 *  A是教练, A每次来新人的时候, 通知 B , 让B来拿人
 *  一般 B 有 8 个跑道, 有空位置, 就拿来 A的人
 * 如果没有空位置了 就不理会 A 的通知, 先不拿
 *
 * 等其中一个跑道人跑完了, 就主动向A拿人, 有人, 继续拿, 没人的话, 那B就休息, 等下次A来叫B拿人
 *
 * 要小心, 如果有新人跑的慢, 或者中间夭折了, 这个人可能会一直站着跑道
 *
 */
var message_1 = require("@clevok/message");
/**
 * 生产者
 */
function Producer() {
    this._loop = []; // 运动员们
    this._loopNum = 0; // 运动员数
}
Producer.prototype = new message_1.Message();
/**
 * 向教练 要一个运动员
 * @return null|event
 */
Producer.prototype.pull = function () {
    if (!this._loopNum)
        return null;
    this._loopNum--;
    return this._loop.shift();
};
/**
 * 给教练 一个新运动员
 */
Producer.prototype.put = function (event) {
    var _this = this;
    this._loopNum++;
    this._loop.push(event);
    event.abort = function () {
        _this.abort(event);
    };
    this.emit('put');
    return event;
};
/**
 * 移除 运动员
 */
Producer.prototype.abort = function (event) {
    for (var i = 0; i < this._loopNum; i++) {
        if (this._loop[i] === event) {
            this._loopNum--;
            return this._loop.splice(i, 1);
        }
    }
};
/**
 * 消费者
 * 主动向 生产者要 食物
 * emit 消化食物 事件
 */
function Consumer(max) {
    if (max === void 0) { max = 8; }
    this._runMax = max; // 最大奔跑
    this._runNum = 0; // 当前奔跑数
}
Consumer.prototype = new message_1.Message();
/**
 * 将一个 运动员塞入进入 跑道
 * @param {function} event 运动员
 */
Consumer.prototype.put = function (event) {
    var _this = this;
    if (!event)
        return;
    ++this._runNum;
    event(function () {
        _this.finsh();
    });
};
Consumer.prototype.finsh = function () {
    --this._runNum;
    this.emit('finsh');
};
/**
 * 轨道上是否已满
 */
Consumer.prototype.hasTask = function () {
    if (this._runNum >= this._runMax) {
        return false;
    }
    return true;
};
/**
 * 生产者 于 消费者
 * @param {number} max 每次接纳的并发数量
 */
function Loop(max) {
    var _this = this;
    if (max === void 0) { max = 8; }
    this.producer = new Producer();
    this.consumer = new Consumer(max);
    this.producer.on('put', function () {
        if (!_this.consumer.hasTask())
            return;
        _this.consumer.put(_this.producer.pull());
    });
    this.consumer.on('finsh', function () {
        if (!_this.consumer.hasTask())
            return;
        _this.consumer.put(_this.producer.pull());
    });
}
exports.default = Loop;
/**
 * 传入执行的方法
 * @param {function} event (finsh)=> {}
 * event finsh参数是个方法, 需手动调用, 表示该方法已调用结束
 */
Loop.prototype.put = function (event) {
    return this.producer.put(event);
};
/**
 * 队列执行
 * demo
 *
 * var loop = new Loop(每次执行最大队列数);
 * loop.put((finsh) => {
 *      setTimeout(()=>{
 *          finsh(); // 表示当前执行完毕, 执行下一个
 *      }, 200)
 * });
 * loop.put((finsh) => {
 *      setTimeout(()=>{
 *          finsh(); // 表示当前执行完毕, 执行下一个
 *      }, 200)
 * });
 */ 
