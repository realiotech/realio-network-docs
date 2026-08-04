---
id: evm-metamask
title: Add Realio Network to MetaMask
sidebar_label: MetaMask Setup
slug: evm-metamask
---

# Add Realio Network to MetaMask

You can add Realio Network to MetaMask (or any other EVM wallet) as a custom network.

1. Open MetaMask and click the network selector at the top, then **Add network** > **Add a network manually**.
2. Fill in the network details:

   **Mainnet**

   | Field             | Value                              |
   |:-------------------|:------------------------------------|
   | Network name       | Realio Network                      |
   | New RPC URL         | Your node's `http://<ip>:8545`, or a public endpoint (see [Mainnet Endpoints](/mainnet/endpoints)) |
   | Chain ID            | `3301`                              |
   | Currency symbol     | `RIO`                               |
   | Block explorer URL  | `https://explorer.realio.network`   |

   **Testnet**

   | Field             | Value                              |
   |:-------------------|:------------------------------------|
   | Network name       | Realio Network Testnet              |
   | New RPC URL         | Your node's `http://<ip>:8545`, or a public endpoint (see [Testnet Endpoints](/testnet/endpoints)) |
   | Chain ID            | `3300`                              |
   | Currency symbol     | `RIO`                               |
   | Block explorer URL  | `https://testnet-explorer.realio.network`   |

3. Save. MetaMask will now show your `RIO` balance and let you sign transactions on Realio Network.

:::caution
Always double check the **Chain ID** you enter. Signing a transaction while connected to the wrong chain ID is a
common cause of lost funds, since the same private key controls the same `0x...` address on every EVM chain.
:::

## Importing an existing Cosmos SDK account

Because Realio Network uses `eth_secp256k1` keys, the private key behind your `realio1...` address is the same
private key behind a `0x...` address. If you already have a `realio-networkd` keyring account and want to use it
in MetaMask, export its private key:

```bash
realio-networkd keys export <key_name> --unarmored-hex --unsafe
```

:::caution
`--unsafe` prints your raw private key to the terminal. Only run this on a machine you trust, and never share
the output with anyone.
:::

Then import it into MetaMask via **Account** > **Import account** > **Private Key**.
