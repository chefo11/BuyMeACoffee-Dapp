// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";

// import "hardhat/console.sol";

contract BuyMeACoffee is Ownable {

    //Memo Event will emit when memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct 
    // struct is basically a custom datatype where we can customize what we want to hold inside it.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all the memos received from friends
    Memo[] memos;


    //this is the Address of the contract deployer
    //It is marked payable so that we can withdraw to this address later
    

    /**
     * This is the buyCoffee function,
     * This will allow our users create a memo
     * which will be sent to us from the front end!
     * The function requires a Name and A Message
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        //Must accept more than 0ETH in other to buy coffee
        require(msg.value >= 0, "can't buy coffee for free");

        //Adds( or creates) the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //We Emit a NewMemo Event with the details of the created memo
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );

    }

    //here we are going to send the entire balance stored in this contract to the owner
    // recheck this function to make sure that it is working as intended
    function withdrawTips() public payable onlyOwner{
        // require (msg.sender == owner, "You are not the owner of this contract");
        require(payable(msg.sender).send(address(this).balance), "Withdrawal Failed");
    }

    //Fetch all the stored Momes
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}