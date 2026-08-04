---
id: setup
title: Setup
sidebar_label: Setup
slug: setup
---

# Become a Realio Network validator
[Validators](01-overview.md) are responsible for committing new blocks to the blockchain through voting.
A validator's stake is slashed if they become unavailable or sign blocks at the same height. Please read about
[Sentry Node Architecture](validator-faq#how-can-validators-protect-themselves-from-denial-of-service-attacks) to protect your node from DDOS attacks and to ensure high-availability.

:::danger Warning
If you want to become a validator for the `mainnet`, you should [research security](/mainnet/overview).
:::

## 1. Run a full node
To become a validator, you must first have `realio-networkd` installed and be able to run a full node. You can
first [setup your full node](/fullnode/overview) if you haven't yet.

The rest of the documentation will assume you have followed our instructions and have successfully set up a full node.

:::tip
Running a validator node should be done on a separate machine, not your local computer. This is due to the fact that
validators need to be constantly running to avoid getting slashed (and thus loosing funds). We highly recommend setting
up a local machine that can run 24/7, even a Raspberry can do the job.
:::

## 2. Create your validator
In order to create a validator, you need to create a local wallet first. This will be used in order to hold the
tokens that you will later delegate to your validator node, allowing him to properly work. In order to create this
wallet, please run:

```shell
realio-networkd keys add <key_name>
```

**or** use the `--recover` flag if you already have a secret recovery phrase (mnemonic phase) you'd want to use:

```shell
realio-networkd keys add <key_name> --recover
```

:::caution Key name
Please select a key name that you will easily remember and be able to type fast. This name will be used all over the
places inside other commands later.
:::

Once that you have created your local wallet, it's time to get some tokens to be used as the initial validator stake so
that it can run properly. If you are setting up a validator inside one of our testnets, you can request some testnet
tokens inside our [Discord](https://discord.gg/Nv9EUbRnKb). Once you have joined, go inside the `#testnet-tokens` channel and
ask us for tokens. Be sure to post your node information (RPC address and Operator account address).


To run a validator node you need to first get your current validator public key that was created when you
ran `realio-networkd init`. Your `realiovalconspub` (Realio Network Validator Consensus Pubkey) can be used to create a new validator by
staking tokens. You can find your validator pubkey by running:

```bash
realio-networkd tendermint show-validator
```

To create your validator, just use the following command:

:::warning Don't use more staking token than you have!

On the testnet, we are using `ario` as the staking token and it will be the example below.

:::

#### Testnet:
```bash
realio-networkd tx staking create-validator \
  --amount=1000000000000000000ario \
  --pubkey=$(realio-networkd tendermint show-validator) \
  --moniker="<Your moniker here>" \
  --chain-id=<chain_id> \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --gas="auto" \
  --gas-adjustment=1.2 \
  --gas-prices="0.025ario" \
  --from=<key_name>
```

:::tip
When specifying the value of the `moniker` flag, please keep in mind this is going to be the public name associated to your validator. For this reason, it should represent your company name or something else that can easily identify you among all the other validators.
:::

:::tip
When specifying commission parameters, the `commission-max-change-rate` is used to measure % _point_ change over the `commission-rate`. E.g. 1% to 2% is a 100% rate increase, but only 1 percentage point.
:::

:::tip
`Min-self-delegation` is a strictly positive integer that represents the minimum amount of self-delegated staking token your validator must always have. A `min-self-delegation` of 1 means your validator will never have a self-delegation lower than `1ario`. A validator with a self delegation lower than this number will automatically be unbonded.
:::

You can confirm that you are in the validator set by using a block explorer:
- Testnet:  [Big Dipper](https://testnet-explorer.realio.network/)

## 3. Edit the validator description
You can edit your validator's public description. This info is to identify your validator, and will be relied on by delegators to decide which validators to stake to. Make sure to provide input for every flag below. If a flag is not included in the command the field will default to empty (`--moniker` defaults to the machine name) if the field has never been set or remain the same if it has been set in the past.

The <key_name> specifies which validator you are editing. If you choose to not include certain flags, remember that the --from flag must be included to identify the validator to update.

The `--identity` can be used as to verify identity with systems like Keybase or UPort. When using with Keybase `--identity` should be populated with a 16-digit string that is generated with a [keybase.io](https://keybase.io) account. It's a cryptographically secure method of verifying your identity across multiple online networks. The Keybase API allows some block explorers to retrieve your Keybase avatar. This is how you can add a logo to your validator profile.

```bash
realio-networkd tx staking edit-validator \
  --moniker="choose a moniker" \
  --website="https://realio.network" \
  --identity=6A0D65E29A4CBC8E \
  --details="To infinity and beyond!" \
  --commission-rate="0.10" \
  --chain-id=<chain_id> \
  --from=<key_name>
```

__Note__: The `commission-rate` value must adhere to the following invariants:

- Must be between 0 and the validator's `commission-max-rate`
- Must not exceed the validator's `commission-max-change-rate` which is maximum
  % point change rate **per day**. In other words, a validator can only change
  its commission once per day and within `commission-max-change-rate` bounds.

### View the validator description
View the validator's information with this command:

```bash
realio-networkd query staking validator <account_realio>
```

## 4. Confirm your validator is running
Your validator is active if the following command returns anything:

```bash
realio-networkd query tendermint-validator-set | grep $(realio-networkd status 2>&1 | jq '.ValidatorInfo.PubKey.value')
```

When you query the node status with `realio-networkd status`, it includes the validator pubkey in base64 encoding. If your node is an active validator, the validator pubkey will be shown when you query the validator set.

You should now see your validator in one of the Realio Network explorers. You are looking for the `bech32` encoded `operator address` starts with `realiovaloper`. It is another representation of your `<key_name>` that you have used to create this validator.

To show the `operator address`, you can run:

```bash
realio-networkd keys show <key_name> -a --bech val
```

:::note Note
To be in the validator set, you need to have more total voting power than the last validator.
:::
