---
id: evm-overview
title: EVM Compatibility
sidebar_label: Overview
slug: evm-overview
---

# EVM Compatibility

Realio Network is a Cosmos SDK chain with a built-in **Ethereum Virtual Machine (EVM)**, powered by the
[Cosmos EVM](https://github.com/cosmos/evm) module. This means that, in addition to native Cosmos SDK
functionality (staking, governance, IBC, ...), Realio Network also supports:

- Deploying and interacting with **Solidity smart contracts**
- Standard Ethereum JSON-RPC, so you can connect wallets like **MetaMask** and tools like **Ethers.js**,
  **Hardhat**, **Foundry** or **Remix** directly to the chain
- **Precompiled contracts** that expose native Cosmos SDK modules (staking, governance, bank, ...) to
  Solidity, so smart contracts can interact with them without leaving the EVM

:::tip
Every account on Realio Network has both a `realio1...` (bech32) address and a `0x...` (hex) address that
map to the same underlying key. Wallets like MetaMask will only ever show you the `0x...` form.
:::

## Chain IDs

Realio Network uses the `<identifier>_<EIP155-chain-id>-<version>` convention for its Cosmos chain ID, so the
EVM chain ID is embedded directly in it:

| Network | Cosmos chain ID        | EVM chain ID (decimal) | EVM chain ID (hex) |
|:--------|:------------------------|:-----------------------|:--------------------|
| Mainnet | `realionetwork_3301-1`  | `3301`                  | `0xCE5`             |
| Testnet | `realionetwork_3300-1`  | `3300`                  | `0xCE4`             |

Always double check the chain ID before signing a transaction, especially when adding custom RPC endpoints to a
wallet.

## Native currency

| Denom (base) | Display denom | Decimals | Symbol |
|:--------------|:---------------|:---------|:-------|
| `ario`         | `rio`           | 18       | `RIO`   |

`RIO` is the token used to pay gas for EVM transactions, and is the one you should use when adding Realio
Network to an EVM wallet.

:::tip
`RIO` isn't the only asset you can bond to a validator — Realio Network also supports staking `RST` and the
ERC-20 token `DSTRX` through its [multistaking](/validators/multistaking) module. Neither is a gas/currency
token, so they're not part of an EVM wallet setup — see the multistaking page for how staking each of them
works.
:::

## Next steps

- RPC endpoints, either through your own node or a public one: [Mainnet Endpoints](/mainnet/endpoints) /
  [Testnet Endpoints](/testnet/endpoints)
- [Add Realio Network to MetaMask](evm-metamask): step-by-step wallet setup
- [Precompiled contracts](evm-precompiles): interact with native Cosmos SDK modules from Solidity
