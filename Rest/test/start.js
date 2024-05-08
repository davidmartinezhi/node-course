import { expect } from "chai";


it('Should add numbers correctly', () => { // this is a test, mocha will run this test
    const num1 = 2
    const num2 = 3
    expect(num1 + num2).to.equal(5);  // Note: use `.equal` instead of `.be`
})


it('Should not sum up to 6', () => { // this is a test, mocha will run this test
    const num1 = 2
    const num2 = 3
    expect(num1 + num2).not.to.equal(6);  // Note: use `.equal` instead of `.be`
})