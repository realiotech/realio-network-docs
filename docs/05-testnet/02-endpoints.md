---
id: endpoints
title: Endpoints
sidebar_label: Endpoints
slug: endpoints
---

# Endpoints
Here below the list of all the useful endpoints you might need to interact with testnet data.

Note that not all endpoints may be active right now on testnet.

:::tip
Peers & seeds are easy to find on our [Discord Group](https://discord.gg/Nv9EUbRnKb). After joining,
look for the #testnet-seeds-peers channel and ask the current members for one if needed.
:::

Running your own node? See the [full node setup guide](/fullnode/setup) — these are the same ports you'll be
exposing. To add the testnet as a custom network in an EVM wallet, see
[Add Realio Network to MetaMask](/evm-compatibility/evm-metamask) (chain ID `3300`).

## RPC

`<node ip address>:26657`

## REST LCD

`<node ip address>:1317`

## gRPC

`<node ip address>:9090`

## ETH JSON RPC

`<node ip address>:8545`

:::tip
The JSON-RPC server isn't enabled by default. Make sure the node you're using was started with the `eth`
namespace, e.g. `realio-networkd start --json-rpc.api eth,txpool,personal,net,debug,web3`.
:::

## ETH WS

`wss://<node ip address>:8546`
