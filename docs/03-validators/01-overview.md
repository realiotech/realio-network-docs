---
id: overview
title: Overview
sidebar_position: 1
---

# Validators Overview

## Introduction
[The Realio Network](../01-intro.mdx) is based on [CometBFT](https://github.com/cometbft/cometbft), which relies on a set of validators that are responsible for committing new blocks in the blockchain. These validators participate in the consensus protocol by broadcasting votes which contain cryptographic signatures signed by each validator's private key.

Validator candidates can bond their own tokens and have the tokens "delegated", or staked, to them by token holders. Thanks to Realio Network's [multistaking](multistaking) module, there are currently 3 assets that can be bonded this way: `RIO`, `RST` (both native) and `DSTRX` (an ERC-20 token) — each validator accepts delegations in exactly one of these assets. The Realio Network will have 100 validators, but over time this can increase depending on the network performance and needs. The validators are determined by who has the most stake delegated to them — the top 100 validator candidates with the most stake will become Realio Network validators.

If validators double sign, are frequently offline or do not participate in governance, their staked tokens (including the tokens of users that delegated to them) can be slashed. The penalty depends on the severity of the violation.


## Community
Discuss the finer details of being a validator on our community chat:

* [Validators Chat](https://discord.gg/Nv9EUbRnKb)
