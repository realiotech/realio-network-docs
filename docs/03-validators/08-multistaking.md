---
id: multistaking
title: Multistaking
sidebar_label: Multistaking
slug: multistaking
---

# Multistaking

Realio Network extends the standard Cosmos SDK staking module with **multistaking**: instead of a single
native staking token, the network can be secured by bonding several different assets side by side.

## The 3 stakeable assets

| Asset   | Type                          | Denom / how it's identified        | Decimals |
|:--------|:-------------------------------|:-------------------------------------|:---------|
| RIO     | Native Cosmos coin              | `ario`                                | 18       |
| RST     | Native Cosmos coin              | `arst`                                | 18       |
| DSTRX   | ERC-20 (Districts token)        | ERC-20 contract address on Realio Network | 18       |

Only [governance](/validators/validator-faq#what-does-participate-in-governance-entail) can add, re-weight, or
remove a stakeable asset — through an `AddMultiStakingCoinProposal` for a native coin, or an
`AddMultiStakingEVMCoinProposal` for an ERC-20 token such as DSTRX. To see the exact live list of accepted
assets and their current weights, run:

```bash
realio-networkd query multi-staking coin-infos
```

## How it works

- **One asset per validator.** Each validator commits to a single bondable asset when it's created — a
  validator created with RIO can only ever be delegated RIO. To stake RST or DSTRX you need to find (or run) a
  validator that was set up to accept that specific asset.
- **It wraps `x/staking`, it doesn't replace it.** When you delegate a multistaking coin, the module locks it
  and mints an internal "bond coin" — using a governance-set **bond weight** — which is what actually gets
  delegated through the standard Cosmos SDK `x/staking` module. Undelegating reverses the process: the bond
  coin is burned and your original asset is released once the unbonding period completes.
- **Everything else is standard staking.** Unbonding periods, redelegation, slashing, commissions and rewards
  all work exactly like regular Cosmos SDK staking — see the [Validator FAQ](/validators/validator-faq) and
  [Delegator FAQ](/delegators/delegator-faq).

## Staking a native coin (RIO / RST)

Native multistaking coins use the regular `staking` commands, e.g. to delegate RIO:

```bash
realio-networkd tx staking delegate <validator-addr> 1000000000000000000ario --from <key_name>
```

(Substitute `arst` to delegate RST instead.) This is exactly the flow already described in the
[validator setup guide](/validators/setup#2-create-your-validator).

## Staking an ERC-20 (DSTRX)

ERC-20 multistaking coins go through the `multi-staking` module's `-evm` commands instead, since the token has
to be locked and converted before it can be delegated through `x/staking`:

```bash
# Create a validator that accepts an ERC-20 asset (e.g. DSTRX)
realio-networkd tx multi-staking create-evm-validator <path/to/validator.json> --from <key_name>

# Delegate DSTRX to a validator
realio-networkd tx multi-staking delegate-evm <validator-addr> <dstrx-contract-address> <amount> --from <key_name>

# Redelegate
realio-networkd tx multi-staking redelegate-evm <src-validator-addr> <dst-validator-addr> <dstrx-contract-address> <amount> --from <key_name>

# Undelegate
realio-networkd tx multi-staking unbond-evm <validator-addr> <dstrx-contract-address> <amount> --from <key_name>

# Cancel an unbonding in progress
realio-networkd tx multi-staking cancel-unbond-evm <validator-addr> <dstrx-contract-address> <amount> <creation-height> --from <key_name>
```

:::tip
You can look up the DSTRX contract address registered on Realio Network with
`realio-networkd query multi-staking coin-infos`, or on the [block explorer](https://explorer.realio.network).
:::

The same operations are available to smart contracts through the **Multistaking precompile**
(`0x0000000000000000000000000000000000000900`) — see [Precompiled Contracts](/evm-compatibility/evm-precompiles).

## Further reading

- [Validator FAQ](/validators/validator-faq) and [Delegator FAQ](/delegators/delegator-faq) — general staking mechanics that still apply
- [Precompiled Contracts](/evm-compatibility/evm-precompiles) — calling multistaking from Solidity
- [`multi-staking` module source](https://github.com/realiotech/multi-staking) — full spec and code
