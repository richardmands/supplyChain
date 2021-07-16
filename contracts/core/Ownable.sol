// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// Provides basic authorization control
contract Ownable {
    address private contractOwner;
    mapping (uint => address) public owners;

    // Define an Event
    event TransferOwnershipOfContract(address indexed oldOwner, address indexed newOwner);
    event TransferOwnershipOfProduct(address indexed oldOwner, address indexed newOwner);

    /// Assign the contract to an owner
    constructor () {
        contractOwner = msg.sender;
        emit TransferOwnershipOfContract(address(0), contractOwner);
    }

    /// Look up the address of the owner
    function ownerOfContract() public view returns (address) {
        return contractOwner;
    }
  
    function ownerOfProduct(uint sku) public view returns (address) {
        return owners[sku];
    }
   
    function setOwnerOfProduct(uint sku) internal {
        owners[sku] = msg.sender;
    }

    /// Define a function modifier 'onlyOwner'
    modifier onlyOwnerOfContract() {
        require(isOwnerOfContract());
        _;
    }
    
    modifier onlyOwnerOfProduct(uint sku) {
        require(isOwnerOfProduct(sku));
        _;
    }

    /// Check if the calling address is the owner of the contract
    function isOwnerOfContract() public view returns (bool) {
        return msg.sender == contractOwner;
    }

    function isOwnerOfProduct(uint sku) public view returns (bool) {
        return msg.sender == owners[sku];
    }

    /// Define a function to renounce ownerhip
    function renounceOwnershipOfContract() public onlyOwnerOfContract {
        emit TransferOwnershipOfContract(contractOwner, address(0));
        contractOwner = address(0);
    }
   
    function renounceOwnershipOfProduct(uint sku) public onlyOwnerOfProduct(sku) {
        emit TransferOwnershipOfProduct(owners[sku], address(0));
        owners[sku] = address(0);
    }

    /// Define a public function to transfer ownership
    function transferOwnershipOfContract(address newOwner) public onlyOwnerOfContract {
        _transferOwnershipOfContract(newOwner);
    }
   
    function transferOwnershipOfProduct(address newOwner, uint sku) public onlyOwnerOfProduct(sku) {
        _transferOwnershipOfProduct(newOwner, sku);
    }

    /// Define an internal function to transfer ownership
    function _transferOwnershipOfContract(address newOwner) internal {
        require(newOwner != address(0));
        emit TransferOwnershipOfContract(contractOwner, newOwner);
        contractOwner = newOwner;
    }
    /// Define an internal function to transfer ownership

    function _transferOwnershipOfProduct(address newOwner, uint sku) internal {
        require(newOwner != address(0));
        emit TransferOwnershipOfProduct(owners[sku], newOwner);
        owners[sku] = newOwner;
    }
}
