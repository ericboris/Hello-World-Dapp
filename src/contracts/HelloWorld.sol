pragma solidity ^0.5.0;

contract HelloWorld {
    string public greeting = '';

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
