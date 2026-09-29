const buttonleftparan = document.getElementById("openparanthesis");
const buttonrightparan = document.getElementById("rightparanthesis");
const buttonclear = document.getElementById("ac");
const buttonequal = document.getElementById("equals");
const buttonadd = document.getElementById("add");
const buttonsub = document.getElementById("sub");
const buttonmul = document.getElementById("mul");
const buttondiv = document.getElementById("div");
const buttonDel = document.getElementById("del");
const buttonpercent = document.getElementById("percent");
const buttonClearHistory = document.getElementById("clearhistory");
const screenOutput = document.getElementsByClassName("now")[0];
const screenHistory = document.getElementsByClassName("history")[0];
let justCalculated = false;
let historyArray = [];
const operators = ["+", "-", "*", "/"];

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function renderHistory() {
  screenHistory.innerHTML = historyArray.join("<br>");
}

function clearScreen() {
  screenOutput.textContent = "";
  justCalculated = false;
}

function appendValue(value) {
  const current = screenOutput.textContent;

  if (justCalculated && /[0-9.]/.test(value)) {
    screenOutput.textContent = "";
    justCalculated = false;
  }

  if (justCalculated && operators.includes(value)) {
    justCalculated = false;
  }

  if (value === ".") {
    const lastNumber = current.split(/[+\-*/()]/).pop();
    if (lastNumber.includes(".")) {
      return;
    }

    if (!lastNumber || operators.includes(current.slice(-1)) || current.slice(-1) === "(") {
      screenOutput.textContent += "0";
    }
  }

  if (operators.includes(value)) {
    if (!current && value !== "-") {
      return;
    }

    const lastCharacter = current.slice(-1);
    if (operators.includes(lastCharacter)) {
      screenOutput.textContent = current.slice(0, -1) + value;
      justCalculated = false;
      return;
    }

    if (lastCharacter === "(" && value !== "-") {
      return;
    }
  }

  screenOutput.textContent += value;
  justCalculated = false;
}

numbers.forEach((num) => {
  document.getElementById(num).addEventListener("click", () => {
    appendValue(num);
  });
});

buttonadd.addEventListener("click", function () {
  appendValue("+");
});
buttonsub.addEventListener("click", function () {
  appendValue("-");
});
buttonmul.addEventListener("click", function () {
  appendValue("*");
});
buttondiv.addEventListener("click", function () {
  appendValue("/");
});
buttonleftparan.addEventListener("click", function () {
  appendValue("(");
});
buttonrightparan.addEventListener("click", function () {
  appendValue(")");
});
buttonpercent.addEventListener("click", function () {
  const current = screenOutput.textContent;
  if (!current) {
    return;
  }

  const match = current.match(/(\d+(?:\.\d+)?)$/);
  if (!match) {
    return;
  }

  const percentValue = String(parseFloat(match[1]) / 100);
  screenOutput.textContent = current.slice(0, -match[1].length) + percentValue;
  justCalculated = false;
});

buttonDel.addEventListener("click", function () {
  if (screenOutput.textContent === "Error") {
    clearScreen();
    return;
  }

  screenOutput.textContent = screenOutput.textContent.slice(0, -1);
  justCalculated = false;
});

buttonClearHistory.addEventListener("click", function () {
  screenHistory.innerHTML = "";
  historyArray = [];
});

buttonclear.addEventListener("click", clearScreen);

function calculate() {
  try {
    const expression = screenOutput.textContent.trim();

    if (!expression) {
      return;
    }

    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }

    const result = Function(`"use strict"; return (${expression});`)();
    if (!Number.isFinite(result)) {
      throw new Error("Math Error");
    }

    historyArray.unshift(expression + " = " + result);
    if (historyArray.length > 5) {
      historyArray.pop();
    }

    renderHistory();
    screenOutput.textContent = String(result);
    justCalculated = true;
  } catch (err) {
    screenOutput.textContent = "Error";
    justCalculated = true;
  }
}

buttonequal.addEventListener("click", calculate);

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/[0-9]/.test(key)) {
    appendValue(key);
    return;
  }

  if (["+", "-", "*", "/", "(", ")", "."].includes(key)) {
    appendValue(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Backspace") {
    buttonDel.click();
    return;
  }

  if (key === "Escape") {
    clearScreen();
    return;
  }
});