"use strict";
const timeInput = document.getElementById("timeinput");
const getTime = document.getElementById("gettime");
const hours = document.querySelector(".hour");
const mins = document.querySelector(".min");
const secs = document.querySelector(".seconds");
const focus = document.querySelector(`button[type="focus"]`);
const form = document.querySelector("form");
const heading = document.querySelector(".heading");
const loader = document.querySelector(".load");
const quick = document.querySelector(".quick_set");
const reset = document.querySelector(`button[type="reset_time"]`);
let focusEnabled = false;
let timeStarted = false;
let timeStoped = false;
let stoppedSeconds;
let initialSeconds;
const keyEvent = new KeyboardEvent("keydown", {
  key: "Enter",
  keyCode: 13,
  which: 13,
});

const showTime = (seconds) => {
  let hour = String(Math.trunc(seconds / 3600)).padStart(2, 0);
  let min = String(Math.trunc((seconds / 60) % 60)).padStart(2, 0);
  let sec = String(Math.trunc(seconds % 60)).padStart(2, 0);
  hours.textContent = hour;
  mins.textContent = min;
  secs.textContent = sec;
};

const setDefault = () => {
  timeStarted = false;
  timeStoped = false;
  getTime.textContent = "Start";
  loader.style.width = `100%`;
  showTime(0);
};
//Start Timer Function
const startTimer = function (second) {
  timeStarted = true;
  let seconds = second;
  if (!timeStoped) loader.style.width = `100%`;
  let percent;
  const timeout = setInterval(() => {
    if (!timeStarted) {
      clearInterval(timeout);
      stoppedSeconds = seconds;
      return;
    }
    seconds--;
    percent = (seconds / initialSeconds) * 100;
    loader.style.width = `${percent}%`;
    showTime(seconds);
    if (seconds == 0) {
      getTime.disable = true;
      clearInterval(timeout);
      document.dispatchEvent(keyEvent);
      heading.innerHTML = `Time <b>Up</b>!`;
      const blink = setInterval(() => {
        if (heading.style.opacity == "1") {
          heading.style.opacity = "0%";
        } else {
          heading.style.opacity = "100%";
        }
      }, 100);
      setTimeout(() => {
        getTime.disable = false;
        setDefault();
        heading.innerHTML = `Timer`;
        clearInterval(blink);
        heading.style.opacity = "1";
      }, 4000);
    }
  }, 1000);
};

//Sets or Converts Timer
const getTimer = function (raw_input) {
  const time = raw_input.split(":");
  const seconds =
    Number(time[0]) * 60 * 60 + Number(time[1]) * 60 + Number(time[2]);
  if (isNaN(seconds) || seconds == 0) {
    alert("Pls Select A Valid Time");
    return;
  }
  startTimer(seconds);
  initialSeconds = seconds;
};

//Event Listener for start button
getTime.addEventListener("click", function () {
  if (!timeStarted && timeStoped) {
    startTimer(stoppedSeconds);
    getTime.textContent = "Stop";
    return;
  }
  if (timeStarted) {
    timeStarted = false;
    timeStoped = true;
    getTime.textContent = "Start";
    return;
  }
  getTimer(timeInput.value);
  getTime.textContent = "Stop";
});

//Event listener for focus button
focus.addEventListener("click", function (e) {
  e.preventDefault();
  focusEnabled = true;
  form.classList.add("display_none");
  heading.style.fontSize = "3vw";
  heading.innerHTML = "Press any <b>key</b> to remove Focus";
  setTimeout(() => {
    if (focusEnabled == true) {
      heading.classList.add("fade_in");
    }
  }, 3000);
});

//Event Listener for undo focus
document.addEventListener("keydown", function (e) {
  if (focusEnabled && e.key !== "F11") {
    form.classList.remove("display_none");
    heading.innerHTML = "Timer";
    heading.style.fontSize = "5vw";
    heading.classList.remove("fade_in");
    focusEnabled = false;
  }
});

//Event Listener for Quick timer
quick.addEventListener("click", function (e) {
  e.preventDefault();
  if (timeStarted) return;
  getTimer(e.target.dataset.value);
  getTime.textContent = "Stop";
});

//Event Listener for Reset
reset.addEventListener("click", function (e) {
  e.preventDefault();
  setDefault();
});
