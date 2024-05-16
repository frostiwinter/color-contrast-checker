/* Populate addEventListener input fields with input color fields */

/* get input-color and add event listener
 * event listener updates the color picker value
 *
 * create a loop per pair of input and picker
 */
function addEventListenersToInputFields() {
  const colorInputGroup = document.querySelectorAll(".input-color");
  const colorPickerGroup = document.querySelectorAll(".input-picker");

  for (const colorInput of colorInputGroup) {
    const colorPicker = colorInput.nextElementSibling;

    colorInput.addEventListener("change", function() {
      colorPicker.value = colorInput.value;
    });

    colorPicker.addEventListener("change", function() {
      colorInput.value = colorPicker.value;
    });
  }
}

/* get button is-remove-color and add event listener
 * if less than 3 buttons, disable
 * else enable
 *
 * to fix, when updating disabled on buttons with add color button
 */
function addEventListenersToRemoveButtons() {
  var removeButtonGroup = document.querySelectorAll(".button.is-remove-color");
  var inputsWrapper = document.getElementsByClassName("inputs_wrapper")[0];

  if (removeButtonGroup.length <= 2) {
    for (const removeButton of removeButtonGroup) {
      removeButton.disabled = true;
    }
  } else {
    for (const removeButton of removeButtonGroup) {
      removeButton.disabled = false;
      removeButton.addEventListener("click", function() {
        removeButton.parentNode.remove();
      });
    }
  }


}

/* get the current amount of input rows
 * add input row HTML to inputs_wrapper
 */
function addInputRows() {
  var inputsWrapper = document.getElementsByClassName("inputs_wrapper")[0];
  var inputNumber = document.getElementsByClassName("input-row").length + 1;
  var inputRow = '<div class="input-row">' + inputNumber + '.<input class="input-color" type="text">or<input class="input-picker" type="color"><button class="button is-remove-color">x</button></div>';

  inputsWrapper.innerHTML += inputRow;

}

/* check if fields are empty
 * add non-empty values to a list
 * return a list in order: top to bottom
 */
function getColorsFromFields() {
  const colorInputGroup = document.querySelectorAll(".input-color");
  var colorList = [];

  for (var i of colorInputGroup) {
    if (i.value != "") {
      colorList.push(i.value);
    }
  }

  return colorList;
}

/* initializes app buttons
 * 
 */
function createButtons() {
  const button1 = document.querySelector(".button.is-generate");

  button1.addEventListener("click", generateColorTable);

}

/* generate color permutations to get all combinations
 */
function getColorPermutations(arr) {
  if (arr.length === 1) {
    return [arr];
  }

  const result = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const remainingPermutations = getColorPermutations(remaining);

    for (let j = 0; j < remainingPermutations.length; j++) {
      result.push([current, ...remainingPermutations[j]]);
    }
  }

  return result;
}

/* generate color rows
 */
function generateColorTable() {
  const colorList = getColorPermutations(getColorsFromFields());
  // console.log(colorList);

  const colorTable = document.querySelector("table");

  function generateLabels() {
    return '<tr><th></th><th class="table_label">WCAG AA 3</th><th class="table_label">WCAG AAA 4.5</th><th class="table_label">WCAG AAA 7</th></tr>';
  }

  function generateColorRow() {
    return '<tr class="generated_color-row"><td class="generated_color-ratio"><div class="color-box"><p class="color-text">The quick brown fox jumped over the lazy doggo</p></div></td><td class="generated_criteria"></td><td class="generated_criteria"></td><td class="generated_criteria"></td></tr>';
  }

  // remove rows and reset labels
  colorTable.innerHTML = "";
  colorTable.innerHTML += generateLabels();
  //console.log(colorList.length);

  // generate the rows
  for (var i = 0; i < colorList.length; i++) {
    if (i == colorList.length) {
      break;
    }

    colorTable.innerHTML += generateColorRow();

    // generate text and background colors
    const colorBoxGroup = document.querySelectorAll(".color-box");
    const colorTextGroup = document.querySelectorAll(".color-text");
    //console.log(colorBoxGroup.length);

    colorTextGroup[i].style.color = colorList[i][0];
    colorBoxGroup[i].style.backgroundColor = colorList[i][1];

    // generate luminance per color group
    var foregroundColor = hexToRgb(rgbToHex(colorTextGroup[i].style.color));
    var backgroundColor = hexToRgb(rgbToHex(colorBoxGroup[i].style.backgroundColor));

    var foregroundLuminance = getLuminance(foregroundColor.r, foregroundColor.g, foregroundColor.b);
    var backgroundLuminance = getLuminance(backgroundColor.r, backgroundColor.g, backgroundColor.b);

    var relativeLuminance = getRelativeLuminance(foregroundLuminance, backgroundLuminance);
    console.log(relativeLuminance);

    // generate WCAG pass or fail
    const colorRow = document.querySelectorAll(".generated_color-row")[i];
    generateWCAGTable(relativeLuminance, colorRow, relativeLuminance);


  }
}

/* generates the color contrast table
 */
function generateWCAGTable(wcagValue, colorRow, relativeLuminance) {
  const criteriaIsPass = '<svg class="checker is-pass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" fill="currentColor"/></svg>';
  const criteriaIsFail = '<svg class="checker is-fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" fill="currentColor"/></svg>';

  // populate if pass or fail  
  const children = colorRow.childNodes;
  const wcagCriteria = [3, 4.5, 7];
  
  for (var i = 0; i < wcagCriteria.length; i++) {
  	if (relativeLuminance >= wcagCriteria[i]) {
    	children[i + 1].innerHTML += criteriaIsPass;
    }
    else {
    	children[i + 1].innerHTML += criteriaIsFail;
    }
  }
}

function startApp() {
  addEventListenersToInputFields();
  createButtons();
  addEventListenersToRemoveButtons();

  const button3 = document.querySelector(".button.is-add-color");
  button3.addEventListener("click", function() {
    addInputRows();
    addEventListenersToInputFields();
    addEventListenersToRemoveButtons();
  });

  // generateWCAGTable();
}

startApp();

function rgbToHex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  function hexCode(i) {
    return ("0" + parseInt(i).toString(16)).slice(-2);
  }
  return "#" + hexCode(rgb[1]) + hexCode(rgb[2]) +
    hexCode(rgb[3]);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/* get luminance of a color using rgb values
 */
function getLuminance(r, g, b) {
  var luminance;

  var rValue = r / 255;
  if (rValue <= 0.03928) {
    rValue = rValue / 12.92;
  } else {
    rValue = ((rValue + 0.055) / 1.055) ** 2.4
  }

  var gValue = g / 255;
  if (gValue <= 0.03928) {
    gValue = gValue / 12.92;
  } else {
    gValue = ((gValue + 0.055) / 1.055) ** 2.4
  }

  var bValue = b / 255;
  if (bValue <= 0.03928) {
    bValue = bValue / 12.92;
  } else {
    bValue = ((bValue + 0.055) / 1.055) ** 2.4
  }

  luminance = 0.2126 * rValue + 0.7152 * gValue + 0.0722 * bValue;

  return luminance;
}

/* get relative luminance of 2 colors
 * uses rgb format of the color
 */
function getRelativeLuminance(rgbForegroundColor, rgbBackgroundColor) {
  var relativeLuminance = (rgbForegroundColor + 0.05) / (rgbBackgroundColor + 0.05);
  /* Contrast ratio is 7:1 */

  return relativeLuminance;
}
