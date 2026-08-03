---
id: evm-precompiles
title: Precompiled Contracts
sidebar_label: Precompiles
slug: evm-precompiles
---

# Precompiled Contracts

Precompiles let Solidity smart contracts call into native Cosmos SDK modules directly, without going through a
separate bridge or off-chain relayer. You interact with them like any other contract, by calling their fixed
address with the corresponding ABI.

## Realio-specific precompiles

On top of the standard set, Realio Network ships two additional precompiles:

| Precompile     | Address                                        | Lets you...                                                       |
|:----------------|:-------------------------------------------------|:---------------------------------------------------------------------|
| Multistaking     | `0x0000000000000000000000000000000000000900`  | Delegate/undelegate ERC-20-format bonded tokens (e.g. `DSTRX`) from a smart contract |
| FeeGrant         | `0x0000000000000000000000000000000000000901`  | Grant and revoke fee allowances from a smart contract              |
| Distribution     | `0x0000000000000000000000000000000000000801`  | Claim staking rewards, query rewards/commission        |

The Multistaking precompile only covers assets registered in ERC-20 format, i.e. `DSTRX` — it does not cover
`RIO` or `RST`, which are staked as native coins (via the standard `staking` commands, not this precompile).
See [Multistaking](/validators/multistaking) for how staking each of the 3 assets works, from both the CLI and
the EVM side.
