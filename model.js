let r = 3;
const R = r * r;

class Model {
  constructor() {
    this.listeners = [];
  }
  notifyAll() {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i].notify();
    }
  }
  addListener(listener) {
    this.listeners.push(listener);
  }
}

class GameModel extends Model {
  constructor() {
    super();
    this.dataPos = [];
    this.finished = true;
    this.success = false;
    this._giveUp = false;
    this.dir = [-3, 1, 3, -1];
    for (let i = 0; i <= R; i++) {
      this.dataPos[i] = i;
    }
  }

  move(i) {
    if (this.finished) {
      return;
    }
    let pos = this.dataPos[i];
    for (let j = 0; j < this.dir.length; j++) {
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
  }

  reset() {
    do {
      this.shuffle();
    } while (!(this.valid() && !this.checkSuccess()));
    this.finished = false;
    this.success = false;
    this.giveUp = false;
    this.notifyAll();
  }

  shuffle() {
    // shuffle the array  randomly
    const arr = [];
    for (let i = 1; i <= R; i++) {
      arr.push({
        val: i,
        priority: Math.random(),
      });
    }
    arr.sort(function (a, b) {
      return a.priority - b.priority;
    });
    for (let i = 0; i < arr.length; i++) {
      this.dataPos[arr[i].val] = i + 1;
    }
  }

  valid() {
    if ((r & 1) == 0) {
      // even.
      // todo
      return false;
    }
    let cnt = 0;
    for (let i = 2; i < R; i++) {
      for (let j = 1; j < i; j++) {
        if (this.dataPos[j] > this.dataPos[i]) {
          cnt++;
        }
      }
    }
    return (cnt & 1) == 0;
  }

  checkSuccess() {
    for (let i = 1; i < R; i++) {
      if (this.dataPos[i] != i) {
        this.finished = false;
        this.success = false;
        return false;
      }
    }
    this.finished = true;
    this.success = true;
    return true;
  }

  get giveUp() {
    return this._giveUp;
  }

  set giveUp(t){
    if(this.finished){
      return;
    }
    this._giveUp=t;
    if(!t){
      return;
    }
    this.finished = true;
    this.success = false;
    this.notifyAll();
  }
}

class TimerModel extends Model {
  constructor() {
    super();
    this._time = 0;
    this.intervalId = null;
  }

  get time() {
    return this._time;
  }

  set time(i) {
    this._time = i;
    this.notifyAll();
  }

  start() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.time = this.time + 1;
    }, 1000);
  }

  stop() {
    if (this.intervalId == null) {
      return;
    }
    clearInterval(this.intervalId);
  }

  reset() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
    this.intervalId = null;
    this.time = 0;
  }
}

let model = new GameModel();
let timerModel = new TimerModel();

// export {r,R,model,timerModel};
