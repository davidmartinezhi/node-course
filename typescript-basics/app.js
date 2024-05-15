"use strict";
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const buttonElement = document.querySelector('button'); // ! means that the element is not null
/*
GENERIC type

Is a type that interacts with another type, it's a placeholder for a type
array is outer type and number is inner type
*/
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
// GENERICS 
/*
Promise is a generic type because eventually it resolves to a value
its the value it resolves to
*/
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('It worked!');
    }, 1000);
}); // generic type, we can define what type of data we expect to get back from promise
myPromise.then(data => {
    console.log(data.split('w'));
});
