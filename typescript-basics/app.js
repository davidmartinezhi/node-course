"use strict";
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const buttonElement = document.querySelector('button'); // ! means that the element is not null
const numResults = [];
const textResults = [];
function add(num1, num2) {
    // adding two numbers
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    // concatenating two strings
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    // mixing number and string
    else {
        return +num1 + +num2;
    }
}
function printResult(resultObj) {
    console.log('Result: ' + resultObj.val);
}
buttonElement.addEventListener('click', function () {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    numResults.push(result);
    const stringResult = add(num1, num2);
    textResults.push(stringResult);
    printResult({ val: result, timestamp: new Date() });
    console.log(numResults, textResults);
});
