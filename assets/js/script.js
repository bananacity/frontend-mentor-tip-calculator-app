const billInput = document.getElementById("bill-total");
const peopleInput = document.getElementById("bill-people");
const customTipInput = document.getElementById("custom-tip-input");
const customTipRadio = document.getElementById("tip-percent-custom");
const radioInputs = document.querySelectorAll('input[name="tip-option"]');

const resetBtn = document.querySelector(".btn-reset");

const tipAmountDisplay = document.getElementById("tip-per-person");
const totalAmountDisplay = document.getElementById("total-per-person");

function calculateSplits() {
  formatBillInput(billInput);
  formatPeopleInput(peopleInput);
  formatCustomTipInput(customTipInput);

  const billTotal = Number(removeCommas(billInput.value) || 0);
  const totalPeople = Number(removeCommas(peopleInput.value) || 0);

  const checkedRadio = document.querySelector(
    'input[name="tip-option"]:checked'
  );
  const selectedTip = checkedRadio ? checkedRadio.value : 0;

  let tipAmount = 0.0;

  if (!(billTotal === 0 || totalPeople === 0)) {
    if (selectedTip !== "custom") {
      tipAmount = billTotal * Number(selectedTip);
    } else {
      tipAmount =
        billTotal * (Number(removePercentage(customTipInput.value)) / 100);
    }

    const tipAmountSplit = tipAmount / totalPeople;
    const totalAmountSplit = (billTotal + tipAmount) / totalPeople;

    tipAmountDisplay.textContent = addCommas(tipAmountSplit.toFixed(2));
    totalAmountDisplay.textContent = addCommas(totalAmountSplit.toFixed(2));

    resetBtn.classList.add("btn--active");
  } else {
    tipAmountDisplay.textContent = "0.00";
    totalAmountDisplay.textContent = "0.00";

    resetBtn.classList.remove("btn--active");
  }

  handleErrors(billTotal, totalPeople);
}

function handleErrors(billTotal, totalPeople) {
  const billContainer = document.getElementById("bill-input-container");
  const peopleContainer = document.getElementById("people-input-container");

  if (billTotal === 0 && totalPeople === 0) {
    billContainer.classList.remove("input-error");
    peopleContainer.classList.remove("input-error");
    return;
  }

  billContainer.classList.toggle("input-error", billTotal === 0);
  peopleContainer.classList.toggle("input-error", totalPeople === 0);
}

function resetForm() {
  billInput.value = "";
  peopleInput.value = "";
  radioInputs.forEach((radio) => {
    radio.checked = false;
  });
  handleCustomTipSelection();

  calculateSplits();
}

function handleCustomTipSelection() {
  if (customTipRadio.checked) {
    customTipInput.classList.add("active");
    customTipInput.focus();
  } else {
    customTipInput.classList.remove("active");
    customTipInput.value = "";
  }
}

// Formatters
function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeCommas(str) {
  return str.replace(/,/g, "");
}

function removePercentage(str) {
  return str.replace(/%/g, "");
}

function formatCustomTipInput(input) {
  let value = input.value;

  // Only digits allowed. No decimal points etc
  value = value.replace(/[^\d]/g, "");

  let numValue = parseInt(value) || 0;
  if (numValue > 999) {
    numValue = 999;
    value = "999";
  }

  input.value = value ? value + "%" : "";
  return numValue;
}

function formatBillInput(input) {
  let value = input.value;

  // Only digits and decimals allowed
  value = value.replace(/[^\d.]/g, "");

  // Only single decimal point allowed
  const parts = value.split(".");
  if (parts.length > 2) {
    // remove any additional decimal points and join the numbers together
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Limit decimal points to 2
  if (parts[1] && parts[1].length > 2) {
    value = parts[0] + "." + parts[1].slice(0, 2);
  }

  const numValue = parseFloat(value);
  if (numValue > 999999.99) {
    value = "999999.99";
  }

  input.value = addCommas(value);
  return parseFloat(value) || 0;
}

function formatPeopleInput(input) {
  let value = input.value;

  // Only digits allowed. No decimal points etc
  value = value.replace(/[^\d]/g, "");

  let numValue = parseInt(value) || 0;
  if (numValue > 9999) {
    numValue = 9999;
    value = "9999";
  }

  value = addCommas(value);

  input.value = value;
  return numValue;
}

// Listeners
billInput.addEventListener("input", calculateSplits);
peopleInput.addEventListener("input", calculateSplits);
customTipInput.addEventListener("input", calculateSplits);

radioInputs.forEach((option) => {
  option.addEventListener("change", () => {
    handleCustomTipSelection();
    calculateSplits();
  });
});

resetBtn.addEventListener("click", resetForm);
