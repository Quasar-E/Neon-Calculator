'use strict';

// history and memory
const btnHistory = document.querySelector('.btn--history');
const btnMemory = document.querySelector('.btn--memory');
const tabHistory = document.querySelector('.tab--history');
const tabMemory = document.querySelector('.tab--memory');
const boxHistory = document.querySelector('.history-box');
const boxMemory = document.querySelector('.memory-box');
const btnDelHistory = document.querySelector('.btn--del-history');
const btnDelMemory = document.querySelector('.btn--del-memory');

// input fields
const sectionInput = document.querySelector('.section--input');
const resultField = document.querySelector('.result-field');
const inputField = document.querySelector('.input-field');

// memory keys
const btnMC = document.querySelector('.btn--MC');
const btnMR = document.querySelector('.btn--MR');
const btnMPlus = document.querySelector('.btn--MPlus');
const btnMMinus = document.querySelector('.btn--MMinus');
const btnMS = document.querySelector('.btn--MS');

// function keys
const btnDelete = document.querySelector('.btn--delete');
const btnClear = document.querySelector('.btn--clear');
const btnDiv = document.querySelector('.btn--div');
const btnMultiply = document.querySelector('.btn--multiply');
const btnPlus = document.querySelector('.btn--plus');
const btnMinus = document.querySelector('.btn--minus');
const btnPercent = document.querySelector('.btn--percent');
const btnEquals = document.querySelector('.btn--equals');

// global variables
let number1 = 0,
  number2 = 0;
let func = ''; // Can be + - ÷ *

// init code
resultField.textContent = '';
inputField.textContent = '0';
boxHistory.innerHTML = '';
boxMemory.innerHTML = '';

// boilerplate for every button
document.querySelector('main').addEventListener('click', e => {
  if (
    e.target.classList.contains('btn') ||
    e.target.classList.contains('btn--tab') ||
    e.target.classList.contains('btn-memory')
  ) {
    e.preventDefault();
    e.target.blur();
  }
});

//////////////////////////////////////
// event listeners for section--memory

// contains all memory
// [index, number]
const memoryMap = new Map();
// just indexer
let indexCounter = 0;

// enable disabled buttons
const enableBtns = () => {
  if (btnMC.disabled) btnMC.disabled = false;
  if (btnMR.disabled) btnMR.disabled = false;
};

// disable enabled buttons :)
const disableBtns = () => {
  if (!btnMC.disabled) btnMC.disabled = true;
  if (!btnMR.disabled) btnMR.disabled = true;
};

// there are different ways to insert first element
// so there is common function
const insertFirst = number => {
  memoryMap.set(indexCounter, number);
  // insert element into the box
  boxMemory.insertAdjacentHTML('afterbegin', composeHTML(indexCounter));
  indexCounter++;

  // enable buttons if disabled
  enableBtns();
};

// composing html for memory element with index
const composeHTML = index => {
  // check just in case
  if (!memoryMap.has(index)) return;

  return `<div class="memory-el el-${index}">
    <p class="memory-line">${memoryMap.get(index)}</p>

    <div class="box-btn-memory">
      <button class="btn-memory btn-memory-MC">MC</button>
      <button class="btn-memory btn-memory-MPlus">M+</button>
      <button class="btn-memory btn-memory-MMinus">M-</button>
    </div>
  </div>`;
};

// buttons--
// memory clear (MC)
btnMC.addEventListener('click', () => {
  memoryMap.clear();
  boxMemory.innerHTML = '';
  disableBtns();
});

// memory recall (MR)
// insert last element in the memory to the input field
btnMR.addEventListener('click', () => {
  // just in case
  if (memoryMap.size === 0) return;

  // Get the last key of the map
  const lastKey = Array.from(memoryMap.keys()).pop();

  // if result is in input field
  if (inputFlag) {
    resultField.textContent = '';
    number1 = 0;
    inputFlag = false;
  }

  inputField.textContent = memoryMap.get(lastKey);
  digitCounter = inputField.textContent.length;
});

// memory add (M+)
// add number in the input field to the last element in the memory
btnMPlus.addEventListener('click', () => {
  // check if there is nothing in the memory
  if (memoryMap.size === 0) {
    insertFirst(getNumber());
    return;
  }

  // Get the last key of the map
  const lastKey = Array.from(memoryMap.keys()).pop();
  // Add new number to the map element and round up
  memoryMap.set(lastKey, +(memoryMap.get(lastKey) + getNumber()).toFixed(6));

  // select memory-line with index and update text content
  boxMemory.querySelector(`.el-${lastKey} .memory-line`).textContent =
    memoryMap.get(lastKey);
});

// memory subtract (M-)
// subtract number in the input field from the last element in the memory
// same logic as adding
btnMMinus.addEventListener('click', () => {
  // check if there is nothing in the memory
  if (memoryMap.size === 0) {
    insertFirst(-getNumber());
    return;
  }

  // Get the last key of the map
  const lastKey = Array.from(memoryMap.keys()).pop();
  // Subtract...
  memoryMap.set(lastKey, +(memoryMap.get(lastKey) - getNumber()).toFixed(6));

  // select memory-line with index and update text content
  boxMemory.querySelector(`.el-${lastKey} .memory-line`).textContent =
    memoryMap.get(lastKey);
});

// memory store (MS)
// store number in the memory
btnMS.addEventListener('click', () => insertFirst(getNumber()));

/////////////////////////////////////
// event listeners for history-memory

// history
btnHistory.addEventListener('click', () => {
  if (tabHistory.classList.contains('disabled')) {
    tabHistory.classList.remove('disabled');
    tabMemory.classList.add('disabled');
    btnDelHistory.classList.remove('disabled');
    btnDelMemory.classList.add('disabled');
  }
});

btnDelHistory.addEventListener('click', () => {
  boxHistory.innerHTML = '';

  btnDelHistory.blur();
});

// memory
btnMemory.addEventListener('click', () => {
  if (tabMemory.classList.contains('disabled')) {
    tabMemory.classList.remove('disabled');
    tabHistory.classList.add('disabled');
    btnDelMemory.classList.remove('disabled');
    btnDelHistory.classList.add('disabled');
  }
});

//event listener for buttons in this section
boxMemory.addEventListener('click', e => {
  if (!e.target.classList.contains('btn-memory')) return;

  // Get parent element with el-*index* class
  const parentEl = e.target.parentNode.parentNode;
  //Get index
  const index = Number(parentEl.classList.value.split('-').at(-1));

  // delete this element from memory
  if (e.target.classList.contains('btn-memory-MC')) {
    // composing exact html and replacing it with empty string
    boxMemory.innerHTML = boxMemory.innerHTML.replace(composeHTML(index), '');
    // deleting element from memoryMap
    memoryMap.delete(index);

    if (memoryMap.size === 0) disableBtns();
  }

  // add number from input to the element
  if (e.target.classList.contains('btn-memory-MPlus')) {
    // Add new number to the map element and round up
    memoryMap.set(index, +(memoryMap.get(index) + getNumber()).toFixed(6));

    // select memory-line with index and update text content
    boxMemory.querySelector(`.el-${index} .memory-line`).textContent =
      memoryMap.get(index);
  }

  // subtract input number from element
  if (e.target.classList.contains('btn-memory-MMinus')) {
    // Subtract
    memoryMap.set(index, +(memoryMap.get(index) - getNumber()).toFixed(6));

    // select memory-line with index and update text content
    boxMemory.querySelector(`.el-${index} .memory-line`).textContent =
      memoryMap.get(index);
  }
});

btnDelMemory.addEventListener('click', () => {
  memoryMap.clear();
  boxMemory.innerHTML = '';
  disableBtns();
  btnDelMemory.blur();
});

/////////////////////////////////////
// event listener for numbers section

// hardcoded initial font size
// Number.parseInt(
//   window.getComputedStyle(inputField).getPropertyValue('font-size')
// );
// 60px 48px 64px 48px
let InitFontSize = 60;

// input sizing check
// input width changes dynamicly
// while input width > container width => font--
const sizingCheck = () => {
  console.log(InitFontSize);

  while (inputField.clientWidth + 40 > sectionInput.clientWidth) {
    inputField.style.fontSize =
      Number.parseInt(
        window.getComputedStyle(inputField).getPropertyValue('font-size')
      ) -
      1 +
      'px';
  }
};

// font++ while not initial
const sizingReverseCheck = () => {
  if (
    Number.parseInt(
      window.getComputedStyle(inputField).getPropertyValue('font-size')
    ) >= InitFontSize
  )
    return;

  while (
    inputField.clientWidth + 30 <= sectionInput.clientWidth &&
    Number.parseInt(
      window.getComputedStyle(inputField).getPropertyValue('font-size')
    ) <= InitFontSize
  ) {
    inputField.style.fontSize =
      Number.parseInt(
        window.getComputedStyle(inputField).getPropertyValue('font-size')
      ) +
      1 +
      'px';
  }
};

// flag -- result in input field
let inputFlag = false;
// <= 20 digits :)
let digitCounter = 0;

document.querySelector('.section--numbers').addEventListener('click', e => {
  if (!e.target.classList.contains('btn')) return;

  // flag check
  if (inputFlag) {
    resultField.textContent = '';
    inputField.textContent = '';
    number1 = 0;
    inputFlag = false;
  }

  // check for 0 in the begining
  if (inputField.textContent[0] === '0')
    inputField.textContent = inputField.textContent.slice(1);

  // text content of buttons
  const text = e.target.textContent;

  switch (text) {
    // negating number
    case '+/-':
      let res = '';
      if (inputField.textContent[0] === '-')
        inputField.textContent = inputField.textContent.substring(1);
      else inputField.textContent = '-' + inputField.textContent;

      //check if input is empty
      if (inputField.textContent === '') inputField.textContent = 0;
      break;

    // dot
    case '.':
      // check is there is a dot && there are digits left to input
      if (!inputField.textContent.includes('.') && digitCounter != 19)
        inputField.textContent += '.';
      break;

    // numbers
    default:
      if (digitCounter < 20) {
        inputField.textContent += e.target.textContent;
        digitCounter++;
      }
      break;
  }

  // Font size check
  sizingCheck();
});

///////////////////////////////////////
// event listeners for function section

// common functions //
// reset all fields
const reset = () => {
  inputField.textContent = 0;
  number1 = 0;
  resultField.textContent = '';
  digitCounter = 0;
};

// get number from input
const getNumber = () => Number(inputField.textContent);

// equals
const equals = () => {
  // for displaying history
  let html = '';

  number2 = getNumber();

  // Check for input flag to prevent repetatve x=x
  if (inputFlag) return;

  // Making x = x
  if (number1 === 0) {
    resultField.textContent = number2 + ' =';
    inputField.textContent = number2;
    number1 = number2;
    inputFlag = true;
    return;
  }

  resultField.textContent += number2 + ' =';

  switch (func) {
    case '÷':
      number1 /= number2;
      break;

    case '*':
      number1 *= number2;
      break;

    case '+':
      number1 += number2;
      break;

    case '-':
      number1 -= number2;
      break;
  }
  // round up result
  number1 = +number1.toFixed(6);

  // My girlfriend asked me to make 2 + 2 = 5, so yeah...
  // if (number1 === 4) number1 = 5;

  //construct and insert html
  html = `<div class="history-el">
    <p class="expression-line">${resultField.textContent}</p>
    <p class="result-line">${number1}</p>
  </div>`;
  boxHistory.insertAdjacentHTML('afterbegin', html);

  // display result in the input field
  inputField.textContent = number1;

  // flag
  inputFlag = true;
};

//common callback
const callback = callFunc => {
  // there is no input
  if (number1 === 0) number1 = getNumber();
  // already some input
  else {
    // check if input was result of previous operation
    // if not so => get result of previous operation
    if (!inputFlag) equals();
    inputFlag = false;
  }

  func = callFunc;
  inputField.textContent = 0;
  digitCounter = 0;
  resultField.textContent = number1 + ` ${callFunc} `;
};

// end of common

// delete
btnDelete.addEventListener('click', () => {
  // input flag
  if (inputFlag) {
    reset();
    inputFlag = false;
  }

  inputField.textContent = inputField.textContent.slice(0, -1);
  if (digitCounter > 0) digitCounter--;

  if (inputField.textContent === '') inputField.textContent = 0;

  sizingReverseCheck();
});

// clear
btnClear.addEventListener('click', reset);

// multiply
btnMultiply.addEventListener('click', callback.bind(null, '*'));

// divide
btnDiv.addEventListener('click', callback.bind(null, '÷'));

// add
btnPlus.addEventListener('click', callback.bind(null, '+'));

// subtract
btnMinus.addEventListener('click', callback.bind(null, '-'));

// percent
btnPercent.addEventListener('click', () => {
  // 6-digit check
  if (Number(inputField.textContent) < 0.0001) return;

  number1 = +(Number(inputField.textContent) / 100).toFixed(6);
  inputField.textContent = number1;
});

// equals
btnEquals.addEventListener('click', equals);

///////////////////////////////
// Event listeners for keyboard

// keyboard key -- class name
const keyClassPairs = new Map([
  ['.', 'dot'],
  ['Backspace', 'delete'],
  ['Delete', 'clear'],
  ['/', 'div'],
  ['*', 'multiply'],
  ['+', 'plus'],
  ['-', 'minus'],
  ['%', 'percent'],
  ['=', 'equals'],
  ['Enter', 'equals'],
]);

// Get class name by number or Map
const getClassName = key => {
  if (/[0-9]/.test(key)) return key;
  else if (keyClassPairs.has(key)) return keyClassPairs.get(key);
};

// keydown and keyup for animating and repetative and non-repetative buttons
document.querySelector('body').addEventListener('keydown', e => {
  // Get button class or null
  const btnClass = getClassName(e.key);

  // if null - return
  if (!btnClass) return;

  const btn = document.querySelector(`.btn--${btnClass}`);

  // for repeating buttons (numbers and backspace)
  if (/[0-9]/.test(btnClass) || btnClass === 'delete') btn.click();

  if (!btn.classList.contains('btn--active')) btn.classList.add('btn--active');
});

document.querySelector('body').addEventListener('keyup', e => {
  // Get button class or null
  const btnClass = getClassName(e.key);

  // if null - return
  if (!btnClass) return;

  const btn = document.querySelector(`.btn--${btnClass}`);

  // for non-repeating buttons !(numbers and backspace)
  if (!(/[0-9]/.test(btnClass) || btnClass === 'delete')) btn.click();

  btn.classList.remove('btn--active');
});

////////////////
// Media queries

const btnHM = document.querySelector('.btn--HM');
const sectionHistory = document.querySelector('.section--history');
const btnCloseHistory = document.querySelector('.btn--close-history');

// first rem change
const firstMQ = window.matchMedia('(max-width: 68em)');
// initial input field font size update
if (firstMQ.matches) InitFontSize = 48;

firstMQ.addEventListener('change', () => {
  if (firstMQ.matches) InitFontSize = 48;
  else InitFontSize = 60;
});

// tablets
const tabletMQ = window.matchMedia('(max-width: 54.7em)');

// initial check
if (tabletMQ.matches) {
  if (btnHM.classList.contains('disabled')) btnHM.classList.remove('disabled');

  if (btnCloseHistory.classList.contains('disabled'))
    btnCloseHistory.classList.remove('disabled');

  if (!sectionHistory.classList.contains('section--history--closed'))
    sectionHistory.classList.add('section--history--closed');

  // initial input field font size update
  InitFontSize = 64;
}

tabletMQ.addEventListener('change', () => {
  if (tabletMQ.matches) {
    // if matches
    if (btnHM.classList.contains('disabled'))
      btnHM.classList.remove('disabled');

    if (btnCloseHistory.classList.contains('disabled'))
      btnCloseHistory.classList.remove('disabled');

    if (!sectionHistory.classList.contains('section--history--closed'))
      sectionHistory.classList.add('section--history--closed');

    // initial input field font size update
    InitFontSize = 64;
  } else {
    //if not
    if (!btnHM.classList.contains('disabled')) btnHM.classList.add('disabled');

    if (!btnCloseHistory.classList.contains('disabled'))
      btnCloseHistory.classList.add('disabled');

    if (sectionHistory.classList.contains('section--history--closed'))
      sectionHistory.classList.remove('section--history--closed');

    // initial input field font size update
    InitFontSize = 48;
  }
});

// buttons event listeneres
btnHM.addEventListener('click', () => {
  sectionHistory.classList.remove('section--history--closed');
});

btnCloseHistory.addEventListener('click', () => {
  if (!sectionHistory.classList.contains('section--history--closed'))
    sectionHistory.classList.add('section--history--closed');
});

// second rem change
const thirdMQ = window.matchMedia('(max-width: 42.5em)');
// initial input field font size update
if (thirdMQ.matches) InitFontSize = 48;

thirdMQ.addEventListener('change', () => {
  if (thirdMQ.matches) InitFontSize = 48;
  else InitFontSize = 64;
});
