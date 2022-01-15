// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// BASE
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// HOLDER
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// LIBS
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract NFTBags is
    ERC721,
    Ownable,
    ERC721Holder,
    ERC1155Holder
{
    string private _uri;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    Counters.Counter private _bagIdCounter;
    
    mapping(uint256 => NFTBag721) private _owners721;

    struct NFTBag721 {
        EnumerableSet.AddressSet tokens;
        mapping(address => EnumerableSet.UintSet) ids;
    }

    constructor() ERC721("NFTBags", "BAG") Ownable() {}

    function setbaseURI(string memory newuri) external onlyOwner {
        _uri = newuri;
    }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }


    function mint(
        address[] memory deposit721,
        uint256[] memory ids721,
        address[] memory deposit1155,
        uint256[] memory ids1155,
        uint256[] memory amount1155
    ) external {
        address sender = msg.sender;
        address to = address(this);
        uint256 currentBagId = _bagIdCounter.current();

        /*
         * 721 Transfers
         */
        require(deposit721.length == ids721.length, "721: deposit != ids");

        for (uint256 i = 0; i < deposit721.length; i++) {
            address token = deposit721[i];
            _owners721[currentBagId].tokens.add(token);
            _owners721[currentBagId].ids[token].add(ids721[i]);
            IERC721(token).safeTransferFrom(sender, to, ids721[i]);
        }

        /*
         * 1155 Transfers
         */
        for (uint256 i = 0; i < deposit1155.length; i++) {
            IERC1155(deposit1155[i]).safeTransferFrom(
                sender,
                to,
                ids1155[i],
                amount1155[i],
                ""
            );
        }

        _safeMint(sender, currentBagId);
        _bagIdCounter.increment();
    }

   // TODO: IF there are too many items, burn will run out of gas , therefore DOSing it. Make a redeem instead.
   function burn(
        address from,
        address to,
        uint256 bagId
    ) external {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );


        NFTBag721 storage bag = _owners721[bagId];
        for (uint256 t = 0; t < bag.tokens.length(); t++) {
            address token = bag.tokens.at(t);
            for (uint256 i = 0; i < bag.ids[token].length(); i++) {
                uint256 id = bag.ids[token].at(i);
                bag.ids[token].remove(id);
                IERC721(token).safeTransferFrom(address(this), to, id);
            }
            bag.tokens.remove(token);
        }

        // TODO: 1155

        _burn(bagId);
    }


    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }



    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        string memory base = _baseURI();
       return string(abi.encodePacked(base, "/token/", tokenId));
    }
}