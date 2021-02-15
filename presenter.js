// import {r,R,model,timerModel} from 'model';

let shouldShow = true;
let canMoveWhenPrepare = true;
const visibleTime = 10;

// add listener for view--presenter
function move(i) {
  model.move(i);
}
// let unvisible = "X";

function start(showNum, needPrepare) {
  canMoveWhenPrepare = needPrepare;
  shouldShow = showNum;
  model.reset();
  timerModel.reset();
  timerModel.start();
}

function reset() {
  model.reset();
  timerModel.reset();
}

function giveUp() {
  model.giveUp = true;
}
// add listener for model--presenter
const gameListener = {
  notify: function () {
    render();
  },
};

model.addListener(gameListener);

const timerListener = {
  notify: function () {
    renderTimer();
  },
};
timerModel.addListener(timerListener);

// render
function render() {
  // render playground
  for (var i = 1; i < R; i++) {
    var domEle = document.getElementById("d" + i);
    var target = "b" + model.dataPos[i];
    var cur = domEle.style.getPropertyValue("grid-area");
    if (cur != target) {
      domEle.style.setProperty("grid-area", target);
    }
  }
  // control timer
  if (model.finished) {
    timerModel.stop();
  }

  // render give up
  if (model.giveUp) {
    doRenderItemColor(true);
    document.getElementById("give-up-text").classList.remove("hidden");
  } else {
    document.getElementById("give-up-text").classList.add("hidden");
  }

  // render success text
  if (model.finished && model.success) {
    document.getElementById("success-text").classList.remove("hidden");
    //.style.setProperty("display", "block");
  } else {
    document.getElementById("success-text").classList.add("hidden");
  }
}

// render timer
function renderTimer() {
  var timerEle = document.getElementById("timer");
  if (canMoveWhenPrepare) {
    timerEle.innerHTML = timerModel.time;
  } else {
    if (timerModel.time < visibleTime) {
      document.getElementById("timecount-text").classList.add("hidden");
      document.getElementById("countdown-text").classList.remove("hidden");
      model.canMove=false;
      timerEle.innerHTML = visibleTime - timerModel.time;
    } else {
      document.getElementById("countdown-text").classList.add("hidden");
      document.getElementById("timecount-text").classList.remove("hidden");
      model.canMove=true;
      timerEle.innerHTML = timerModel.time - visibleTime;
    }
  }

  renderItemColor();
}

function renderItemColor() {
  // check visible
  // console.log(domEle.innerText);
  const needShow = shouldShow || timerModel.time <= visibleTime;
  doRenderItemColor(needShow);
}

function doRenderItemColor(needShow) {
  let targetColor = needShow ? "white" : "lightgrey";

  for (var i = 1; i < R; i++) {
    var domEle = document.getElementById("d" + i);
    var cur = domEle.style.getPropertyValue("color");

    if (cur != targetColor) {
      domEle.style.setProperty("color", targetColor);
    }
  }
}
function renderComment() {
  document.getElementById("comment-num").innerText = visibleTime;
}
// init
render();
renderTimer();
renderComment();
