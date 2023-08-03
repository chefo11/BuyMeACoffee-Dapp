//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

error BuyMeACoffee__NotOwner();


contract BuyMeACoffee {

 
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    
    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner;

    // List of all memos received from coffee purchases.
    Memo[] memos;

     // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner);
        if (msg.sender != owner) revert BuyMeACoffee__NotOwner();
        _;
    }

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function getBalanceAccount() public view returns (uint256){
        return msg.sender.balance;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {

        //Must accept more than 0ETH in other to buy coffee
        require(msg.value > 0, "can't buy coffee for free");

        // Check that the name and message are not empty strings
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_message).length > 0, "Message cannot be empty");


        // Add the memo to storage!
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }


    //here we are going to send the entire balance stored in this contract to the owner
    // recheck this function to make sure that it is working as intended
     function withdrawTips() public payable onlyOwner {
    require(address(this).balance > 0, "No balance to withdraw");

    address payable ownerAddress = payable(owner());
    require(ownerAddress != address(0), "Invalid owner address");

    ownerAddress.transfer(address(this).balance);
}

    //Fetch all the stored Momes
    function getMemos() public view returns (Memo[] memory) {
        return memos;

    }
}
