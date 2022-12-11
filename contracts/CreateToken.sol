// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./ERC20.sol";

contract CreateToken is ERC20 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    /**
     * @dev Constructor.
     * @param name name of the token
     * @param symbol symbol of the token, 3-4 chars is recommended
     * @param decimals number of decimal places of one token unit, 18 is widely used
     * @param totalSupply total supply of tokens in lowest units (depending on decimals)
     * @param tokenOwnerAddress address that gets 100% of token supply
     */
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        address tokenOwnerAddress
    ) {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;

        // set tokenOwnerAddress as owner of all tokens
        _mint(tokenOwnerAddress, totalSupply);
    }

    /**
     * @dev Burns a specific amount of tokens.
     * @param value The amount of lowest token units to be burned.
     */
    function burn(uint256 value) public {
        _burn(msg.sender, value);
    }

  

    /**
     * @return the name of the token.
     */
    function getName() public view returns (string memory) {
        return _name;
    }

    /**
     * @return the symbol of the token.
     */
    function getSymbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @return the number of decimals of the token.
     */
    function getDecimals() public view returns (uint8) {
        return _decimals;
    }
}
