---
id: genesis-file
title: Genesis File
sidebar_label: Genesis File
slug: genesis-file
---

# Genesis file

To connect to the mainnet, you will need the corresponding genesis file. Visit the [mainnet repo](https://github.com/realiotech/mainnet) and download the correct genesis file by running the following command.

```bash
# Download the existing genesis file for the testnet
# Replace <chain-id> with the id of the testnet you would like to join
curl https://raw.githubusercontent.com/realiotech/mainnet/master/realionetwork_3301-1/genesis.json > $HOME/.realio-network/config/genesis.json
```

:::important
Always verify the genesis sha256 checksum before starting your node. You can find the checksum in the repository's README.md file.
:::
