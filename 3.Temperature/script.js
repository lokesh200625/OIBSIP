const tempInput = document.getElementById("tempInput");
const unitSelect = document.getElementById("unitSelect");
const convertBtn = document.getElementById("convertBtn");
const errorMsg = document.getElementById("errorMsg");
const resultBox = document.getElementById("result");
const resC = document.getElementById("resC");
const resF = document.getElementById("resF");
const resK = document.getElementById("resK");

// Absolute zero in each unit
const ABSOLUTE_ZERO = { C: -273.15, F: -459.67, K: 0 };
const UNIT_NAMES = { C: "Celsius", F: "Fahrenheit", K: "Kelvin" };

// Accepts values like 25, -10, +3.5, .5, 12.
const NUMBER_PATTERN = /^[-+]?(\d+\.?\d*|\.\d+)$/;

function showError(message) {
  errorMsg.textContent = message;
  tempInput.classList.add("invalid");
  resultBox.hidden = true;
}

function clearError() {
  errorMsg.textContent = "";
  tempInput.classList.remove("invalid");
}

// Returns an error message string, or "" when the input is valid
function validate() {
  const raw = tempInput.value.trim();

  if (raw === "") {
    return "Please enter a temperature value.";
  }
  if (!NUMBER_PATTERN.test(raw)) {
    return "Invalid input: please enter numbers only (e.g. 25 or -10.5).";
  }

  const value = parseFloat(raw);
  const unit = unitSelect.value;

  if (value < ABSOLUTE_ZERO[unit]) {
    const limit = ABSOLUTE_ZERO[unit];
    return "Impossible value: temperatures below absolute zero (" + limit + " " + UNIT_NAMES[unit] + ") do not exist.";
  }
  return "";
}

function toCelsius(value, unit) {
  if (unit === "C") return value;
  if (unit === "F") return (value - 32) * 5 / 9;
  return value - 273.15; // Kelvin
}

function format(num, symbol) {
  // Avoid "-0.00"
  const rounded = Math.abs(num) < 0.005 ? 0 : num;
  return rounded.toFixed(2) + " " + symbol;
}

function convert() {
  const error = validate();
  if (error) {
    showError(error);
    return;
  }
  clearError();

  const value = parseFloat(tempInput.value.trim());
  const celsius = toCelsius(value, unitSelect.value);
  const fahrenheit = celsius * 9 / 5 + 32;
  const kelvin = celsius + 273.15;

  resC.textContent = format(celsius, "°C");
  resF.textContent = format(fahrenheit, "°F");
  resK.textContent = format(kelvin, "K");
  resultBox.hidden = false;
}

// Convert on button click
convertBtn.addEventListener("click", convert);

// Allow Enter key to convert
tempInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") convert();
});

// Real-time validation while typing
tempInput.addEventListener("input", () => {
  if (tempInput.value.trim() === "") {
    clearError();
    resultBox.hidden = true;
    return;
  }
  const error = validate();
  if (error) {
    showError(error);
  } else {
    clearError();
  }
});

// Re-check when the unit changes (absolute zero limit differs per unit)
unitSelect.addEventListener("change", () => {
  if (tempInput.value.trim() !== "") {
    const error = validate();
    if (error) showError(error);
    else clearError();
  }
  resultBox.hidden = true;
});
