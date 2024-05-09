export function asyncIter<T = any>(task: Array<T>, callback: (item: T, index: number) => void) {
  let taskIndex = 0;
  return new Promise<void>((resolve) => {
    function run() {
      if (taskIndex < task.length) {
        callback(task[taskIndex], taskIndex);
        taskIndex++;
        requestAnimationFrame(run);
      } else {

        if (taskIndex === task.length) {
          resolve();
        }
      }
    }
    run();
  })
}
