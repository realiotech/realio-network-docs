---
id: evm-deploying-contracts
title: Deploying a dApp
sidebar_label: Deploying a dApp
slug: evm-deploying-contracts
---

# Deploying a dApp

Realio Network currently restricts who can deploy smart contracts on the EVM. This is not a technical
limitation of the chain — it's a permissioning layer so that every contract deployed on Realio Network has been
reviewed beforehand. If you want to deploy a dApp, you'll need to go through the following process before you
can send a contract-creation transaction.

## 1. Request a review

Contact the Realio team through [Realio Support](https://support.realio.network/hc/en-us) and share your
project's **public, verifiable source code**. The team will review it before it can be considered for
deployment access.

## 2. Apply through governance

Once your contract has been reviewed, apply to have your deployer address allow-listed by submitting a
[governance proposal](/validators/validator-faq#what-does-participate-in-governance-entail). Only after the
proposal passes will your address be able to deploy contracts on Realio Network.

:::tip
Reach out to Realio Support early, before your source code is finalized — getting review feedback ahead of
submitting your governance proposal will save you a round trip.
:::

## 3. Deploy

Once your deployer address is approved on-chain, you can deploy like on any other EVM chain — via Hardhat,
Foundry, Remix, or any other tool that speaks the standard Ethereum JSON-RPC. See
[EVM Compatibility](evm-overview) for chain IDs and endpoints.
