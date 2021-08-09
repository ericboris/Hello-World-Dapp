const HelloWorld = artifacts.require('HelloWorld');

contract('Hello World', async () => {
    let hw;

    before(async () => {
        hw = await HelloWorld.deployed(); 
    });

    it('Set greeting', async () => {
        await hw.setGreeting('Hello World');
        let greeting = await hw.greeting();
        assert.equal(greeting, 'Hello World');
    });
});
