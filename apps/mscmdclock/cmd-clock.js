let locale = require("locale");

g.clear();
// Reset the state of the graphics library
g.reset();

const width = g.getWidth();
const height = g.getHeight();
const font = "6x8";
const fontSizeM = 2;
const fontSizeL = 5;
const fontHeightM = 10 * fontSizeM;
const fontHeightL = 10 * fontSizeL;
//Since we have 3 M-lines and 1 L-line
const totalFontHeight = (3 * fontHeightM) + fontHeightL;
const extraTxt = [
  "shutdown /s", "rm -rf /", "ipconfig /all"
];
const x = 5;
//y depends on line
const y = [
  ((height - totalFontHeight) / 2),
  ((height - totalFontHeight) / 2) + fontHeightL,
  ((height - totalFontHeight) / 2) + fontHeightL + fontHeightM,
  ((height - totalFontHeight) / 2) + fontHeightL + (2 * fontHeightM),
  ((height - totalFontHeight) / 2) + fontHeightL + (3 * fontHeightM)
];

let date = new Date();
let hour = "00";
let minute = "00";
let dayOfWeek = "Monday";
let day = "01";
let month = "01";
let year = "0000";
let extraTxtIndex = 0;

let getSecondsRemaininigInMinute = () => {
  return (60 - new Date().getSeconds()) * 1000;
};

let getExtraText = () => {
  if(extraTxtIndex >= extraTxt.length)
    extraTxtIndex = 0;
  return extraTxt[extraTxtIndex++];
};

let draw = (txt, line) => {
  let fontSizeToUse = fontSizeM;
  let fontHeightToClear = fontHeightM;
  let yToUse = y[line];
  let xToUse = x;

  if(line === 0){
    fontSizeToUse = fontSizeL;
    fontHeightToClear = fontHeightL;
    //with this font, 6 chars can fit the screen
    //so: width / 6 gives me the width of one char
    //divide the one char by two gives me the start x-pos
    xToUse = ((width / 6) /2);
  }
  else
    txt = `>${txt}`;

  g.clearRect(0, yToUse, width, yToUse + fontHeightToClear-1);
  g.setFontAlign(-1, -1)
    .setFont(font, fontSizeToUse)
    .drawString(txt, xToUse, yToUse);
};

let updateData = () => {
  date = new Date();

  if(minute === "00"){
    dayOfWeek = locale.dow(date).toLowerCase();
    let dateArr = locale.date(date, 1).split("/");
    day = dateArr[0];
    month = dateArr[1];
    year = dateArr[2];

    draw(`${day}/${month}/${year}`, 1);
    draw(`${dayOfWeek}`, 2);
  }

  let time = locale.time(date, 1).split(":");
  hour = time[0].replace(" ", "0");
  minute = time[1];

  draw(`${hour}:${minute}`, 0);
  draw(`${getExtraText()}`, 3);
};

let startClock = () => {
  //count down the seconds left in this minute
  //then, start the 'update' every minute
  //so we only redraw the screen once per minute
  setTimeout(function() {
    updateData();
    setInterval(updateData, 60000);
  }, getSecondsRemaininigInMinute());
};

// Show launcher when middle button pressed
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();

updateData();
startClock();
draw(`_`, 4);

//App flow:
// 1. Start the clock
//      This will draw everything once
//      Starts a clock which calculates the remaining seconds of the current minute
//      After these remaining seconds have passed, redraw + start a regular timer every 60 seconds
//      This makes it redraw as little as possible for efficiency
// 2. Draw
//      If (minutes == 00) we check a change in date
//      Clears part of the screen, only the line which we're going to redraw
