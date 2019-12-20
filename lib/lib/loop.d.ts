/**
 * 生产者 于 消费者
 * @param {number} max 每次接纳的并发数量
 */
export default function Loop(max?: number): void;
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
