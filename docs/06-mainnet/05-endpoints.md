---
id: endpoints
title: Endpoints
sidebar_label: Endpoints
slug: endpoints
---

# Endpoints
Here below the list of all the useful endpoints you might need to interact with mainnet data.

:::tip
Mainnet peers & public endpoints are easy to find on our [Discord Group](https://discord.gg/Nv9EUbRnKb) (look
for the #mainnet-seeds-peers channel), or in the
[Realio entry of the Cosmos Chain Registry](https://github.com/cosmos/chain-registry/tree/master/realio),
which lists community-run `apis.rpc`, `apis.rest`, `apis.grpc` and `apis.evm-http-jsonrpc` endpoints. Registry
entries are community-run and can change, so treat this as a starting point rather than a fixed list.
:::

Running your own node? See the [full node setup guide](/fullnode/setup) — these are the same ports you'll be
exposing. To add mainnet as a custom network in an EVM wallet, see
[Add Realio Network to MetaMask](/evm-compatibility/evm-metamask) (chain ID `3301`).

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
