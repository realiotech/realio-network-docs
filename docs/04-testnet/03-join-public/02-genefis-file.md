---
id: genesis-file
title: Genesis File
sidebar_label: Genesis File
slug: genesis-file
---

# Genesis file
:::caution Testnet only   
To configure a full node for the **testnet** you need to use the following [seed](03-seeds.md) nodes. If you are looking for mainnet seed nodes, please refer to [this](/mainnet/overview) instead.
:::

To connect to the testnet, you will need the corresponding genesis file of each testnet. Visit the [testnet repo](https://github.com/realiotech/testnets) and download the correct genesis file by running the following command.

```bash
# Download the existing genesis file for the testnet
# Replace <chain-id> with the id of the testnet you would like to join
curl https://raw.githubusercontent.com/realiotech/testnets/master/realionetwork_1110-2/genesis.json > $HOME/.realio-network/config/genesis.json
```
