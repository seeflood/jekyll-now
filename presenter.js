// import {r,R,model,timerModel} from 'model';

// add listener for view--presenter
function move(i) {
  model.move(i);
}
let shouldShow = true;
let visibleTime = 10;
// let unvisible = "X";

function start(showNum) {
  shouldShow = showNum;
  model.reset();
  timerModel.reset();
  timerModel.start();
}

function reset() {
  model.reset();
  timerModel.reset();
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
  // render success text
  if (model.finished && model.success) {
    timerModel.stop();
    document
      .getElementById("success-text").classList.remove("hidden");
      //.style.setProperty("display", "block");
  }else{
    document
      .getElementById("success-text").classList.add("hidden");
  }
}

// render timer
function renderTimer() {
  var timerEle = document.getElementById("timer");
  timerEle.innerHTML = timerModel.time;

  // check visible
  // console.log(domEle.innerText);
  let needShow = shouldShow || timerModel.time <= visibleTime;
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
    document.getElementById("comment-num").innerText=visibleTime;
}
// init
render();
renderTimer();
renderComment();
