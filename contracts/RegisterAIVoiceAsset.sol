// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IIPAssetRegistry } from "@story-protocol/protocol-core/contracts/interfaces/registries/IIPAssetRegistry.sol";
import { ILicensingModule } from "@story-protocol/protocol-core/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import { IPILicenseTemplate } from "@story-protocol/protocol-core/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILFlavors } from "@story-protocol/protocol-core/contracts/lib/PILFlavors.sol";

//import { SUSD } from "./mocks/SUSD.sol";
//import { SimpleNFT } from "./mocks/SimpleNFT.sol";
import './AIVoiceNFT.sol';

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

/// @notice Register an NFT as an IP Account.
contract RegisterAIVoiceAsset is ERC721Holder  {
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    ILicensingModule public immutable LICENSING_MODULE;
    IPILicenseTemplate public immutable PIL_TEMPLATE;
    address public immutable ROYALTY_POLICY_LAP;
    address public immutable WIP;
    //AIVoiceNFT public immutable AIVoice_NFT;

    event MintAndRegisterAndCreateTermsAndAttach(address nftToken, uint256 tokenId, address ipId, uint256 licenseTermsId);

    constructor(
        address ipAssetRegistry,
        address licensingModule,
        address pilTemplate,
        address royaltyPolicyLAP,
        address wip
        //address nftToken
    ) {
        IP_ASSET_REGISTRY = IIPAssetRegistry(ipAssetRegistry);
        LICENSING_MODULE = ILicensingModule(licensingModule);
        PIL_TEMPLATE = IPILicenseTemplate(pilTemplate);
        ROYALTY_POLICY_LAP = royaltyPolicyLAP;
        WIP = wip;
        //AIVoice_NFT = AIVoiceNFT(nftToken);
        //SUSD_TOKEN = SUSD(susdToken);
        // Create a new Simple NFT collection
        //SIMPLE_NFT = new SimpleNFT("Simple IP NFT", "SIM");
        //SIMPLE_NFT = SimpleNFT(nftToken);
    }

    /// @notice Mint an NFT, register it as an IP Asset, and attach License Terms to it.
    /// @param receiver The address that will receive the NFT/IPA.
    /// @return tokenId The token ID of the NFT representing ownership of the IPA.
    /// @return ipId The address of the IP Account.
    /// @return licenseTermsId The ID of the license terms.
    function mintAndRegisterAndCreateTermsAndAttach(
        address receiver,
        string memory _voiceURL,
        address nftToken,
        string memory _emotionLevel1, string memory _emtionLevel2, string memory _emotionLevel3
    ) external returns (uint256 tokenId, address ipId, uint256 licenseTermsId) {
        // We mint to this contract so that it has permissions
        // to attach license terms to the IP Asset.
        // We will later transfer it to the intended `receiver`
        AIVoiceNFT AIVoice_NFT = AIVoiceNFT(nftToken);
        tokenId = AIVoice_NFT.mint(_voiceURL, _emotionLevel1, _emtionLevel2, _emotionLevel3);
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(AIVoice_NFT), tokenId);
        
        // register license terms so we can attach them later
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(
            PILFlavors.commercialRemix({
                mintingFee: 0,
                commercialRevShare: 10 * 10 ** 6, // 10%
                royaltyPolicy: address(ROYALTY_POLICY_LAP),
                currencyToken: WIP
            })
        );
        
        // attach the license terms to the IP Asset
        LICENSING_MODULE.attachLicenseTerms(ipId, address(PIL_TEMPLATE), licenseTermsId);
    
        // transfer the NFT to the receiver so it owns the IPA
        AIVoice_NFT.transferFrom(address(this), receiver, tokenId);

        emit MintAndRegisterAndCreateTermsAndAttach(nftToken, tokenId, ipId, licenseTermsId);
    }

    /// @notice Mint and register a new child IPA, mint a License Token
    /// from the parent, and register it as a derivative of the parent.
    /// @param parentIpId The ipId of the parent IPA.
    /// @param licenseTermsId The ID of the license terms you will
    /// mint a license token from.
    /// @param receiver The address that will receive the NFT/IPA.
    /// @return childTokenId The token ID of the NFT representing ownership of the child IPA.
    /// @return childIpId The address of the child IPA.
    function mintLicenseTokenAndRegisterDerivative(
        address parentIpId,
        uint256 licenseTermsId,
        address receiver,
        string memory _voiceURL,
        address nftToken,
        string memory _emotionLevel1, string memory _emtionLevel2, string memory _emotionLevel3
    ) external returns (uint256 childTokenId, address childIpId) {
        // We mint to this contract so that it has permissions
        // to register itself as a derivative of another
        // IP Asset.
        // We will later transfer it to the intended `receiver`
        AIVoiceNFT AIVoice_NFT = AIVoiceNFT(nftToken);
        childTokenId = AIVoice_NFT.mint(_voiceURL, _emotionLevel1, _emtionLevel2, _emotionLevel3);
        childIpId = IP_ASSET_REGISTRY.register(block.chainid, address(AIVoice_NFT), childTokenId);

        // mint a license token from the parent
        uint256 licenseTokenId = LICENSING_MODULE.mintLicenseTokens({
            licensorIpId: parentIpId,
            licenseTemplate: address(PIL_TEMPLATE),
            licenseTermsId: licenseTermsId,
            amount: 1,
            // mint the license token to this contract so it can
            // use it to register as a derivative of the parent
            receiver: address(this),
            royaltyContext: "", // for PIL, royaltyContext is empty string,
            maxMintingFee: 0,
            maxRevenueShare: 0
        });

        uint256[] memory licenseTokenIds = new uint256[](1);
        licenseTokenIds[0] = licenseTokenId;

        // register the new child IPA as a derivative
        // of the parent
        LICENSING_MODULE.registerDerivativeWithLicenseTokens({
            childIpId: childIpId,
            licenseTokenIds: licenseTokenIds,
            royaltyContext: "", // empty for PIL
            maxRts: 0
        });

        // transfer the NFT to the receiver so it owns the child IPA
        AIVoice_NFT.transferFrom(address(this), receiver, childTokenId);
    }
}
