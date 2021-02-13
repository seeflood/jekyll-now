let r = 3;
const R = r * r;

const model = {
  dataPos: [],
  finished: true,
  success: false,
  listeners: [],
  dir: [-3, 1, 3, -1],
  move: function (i) {
    if (this.finished) {
      return;
    }
    var pos = this.dataPos[i];
    for (var j = 0; j < this.dir.length; j++) {
      let x = this.dir[j];
      let newPos = pos + x;
      if (newPos > 0 && newPos <= R && this.dataPos[R] == newPos) {
        this.dataPos[R] = pos;
        this.dataPos[i] = newPos;
        this.checkSuccess();
        this.notifyAll();
        return;
      }
    }
  },
  onCreate: function () {
    for (var i = 0; i <= R; i++) {
      this.dataPos[i] = i;
    }
  },
  reset: function () {
    do {
      this.shuffle();
    } while (!(this.valid() && !this.checkSuccess()));
    this.finished = false;
    this.success = false;
    this.notifyAll();
  },
  shuffle: function () {
    // shuffle the array  randomly
    const arr = [];
    for (var i = 1; i <= R; i++) {
      arr.push({
        val: i,
        priority: Math.random(),
      });
    }
    arr.sort(function (a, b) {
      return a.priority - b.priority;
    });
    for (var i = 0; i < arr.length; i++) {
      this.dataPos[arr[i].val] = i + 1;
    }
  },
  valid: function () {
    if ((r & 1) == 0) {
      // even.
      // todo
      return false;
    }
    let cnt = 0;
    for (var i = 2; i < R; i++) {
      for (var j = 1; j < i; j++) {
        if (this.dataPos[j] > this.dataPos[i]) {
          cnt++;
        }
      }
    }
    return (cnt & 1) == 0;
  },
  checkSuccess: function () {
    for (var i = 1; i < R; i++) {
      if (this.dataPos[i] != i) {
        this.finished = false;
        this.success = false;
        return false;
      }
    }
    this.finished = true;
    this.success = true;
    return true;
  },
  notifyAll: function () {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i].notify();
    }
  },
  addListener: function (listener) {
    this.listeners.push(listener);
  },
};

const timerModel = {
  time: 0,
  intervalId: null,
  setTime: function (i) {
    this.time = i;
    this.notifyAll();
  },
  listeners: [],
  onCreate: function () {},
  start: function () {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.setTime(this.time + 1);
    }, 1000);
  },
  stop: function () {
    if (this.intervalId == null) {
      return;
    }
    clearInterval(this.intervalId);
  },
  reset: function () {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
    this.intervalId = null;
    this.setTime(0);
  },
  addListener: function (listener) {
    this.listeners.push(listener);
  },
  notifyAll: function () {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i].notify();
    }
  },
};

model.onCreate();
timerModel.onCreate();

// debug
// for (var i = 1; i <= R; i++) {
//   model.dataPos[R - i] = i;
// }
