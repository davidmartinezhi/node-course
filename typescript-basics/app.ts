
const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button') as HTMLButtonElement;// ! means that the element is not null

/*
GENERIC type

Is a type that interacts with another type, it's a placeholder for a type
array is outer type and number is inner type
*/
const numResults: Array<number> = [];
const textResults: string[] = [];

type NumOrString = number | string; // union type, with type alias we can define our own types
type ResultObj = { val: number, timestamp: Date };

/*
TYPE AND INTERFACE
Just to define structure of an object we can use type alias or interface
but interfaces can force classes to implement functions or properties in objects

If we add class or constructor function, class name can be used as a type as well
it doesn't matter if you defined it or not, it will be used as a type 
*/
interface ResultObj2 { 
    val: number;
    timestamp: Date;
}

function add(num1: NumOrString, num2: NumOrString): NumOrString {
    
    // adding two numbers
    if(typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    // concatenating two strings
    else if(typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    // mixing number and string
    else {
        return +num1 + +num2;
    }
}

function printResult(resultObj: ResultObj) {
    console.log('Result: ' + resultObj.val);
}

buttonElement.addEventListener('click', function() {
    const num1 = num1Element.value;
    const num2 = num2Element.value;

    const result = add(+num1, +num2);
    numResults.push(result as number);

    const stringResult = add(num1, num2);
    textResults.push(stringResult as string);

    printResult({val: result as number, timestamp: new Date()});
    console.log(numResults, textResults);
});


// GENERICS 
/*
Promise is a generic type because eventually it resolves to a value
its the value it resolves to
*/
const myPromise = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
        resolve('It worked!');
    }, 1000);
}); // generic type, we can define what type of data we expect to get back from promise

myPromise.then(data => {
    console.log(data.split(' '));
});