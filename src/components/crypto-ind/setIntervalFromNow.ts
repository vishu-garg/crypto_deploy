const setIntervalFromNow: (func1: Function, time: number) => number = (func: Function, time: number) => {
  func();
  return setInterval(func, time);
};

export default setIntervalFromNow;
