/* Populate addEventListener input fields with input color fields */

/* get input-color and add event listener
 * event listener updates the color picker value
 *
 * create a loop per pair of input and picker
 */
function populateInputFields() {
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

/* check if fields are empty
 * add non-empty values to a list
 * return a list
 */
function getColorsFromFields() {
  const colorInputGroup = document.querySelectorAll(".input-color");

  for (var i of colorInputGroup) {
    if (i.value != "") {
      // console.log(i.value);

      // var hexValue = hexToRgb(i.value);

      // console.log(getLuminance(hexValue.r, hexValue.g, hexValue.b));
      // return i.value;
    }
  }
}

function createGenerateButton() {
  const button1 = document.querySelector(".button.is-generate");
  const button2 = document.querySelector(".button.is-check");

  button1.addEventListener("click", getColorsFromFields);
  button2.addEventListener("click", function() {
    var color1 = hexToRgb("#ffffff");
    var color2 = hexToRgb("#5f1bd6");

    var L1 = getLuminance(color1.r, color1.g, color1.b);
    var L2 = getLuminance(color2.r, color2.g, color2.b);

    console.log(getRelativeLuminance(L1, L2));

  });
}

function startApp() {
  populateInputFields();
  createGenerateButton();
}

startApp();

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
