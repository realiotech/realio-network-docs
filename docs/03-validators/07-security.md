---
id: security
title: Validator Security
sidebar_label: Security
slug: security
---

# Validator Security

:::important

The [CometBFT Validators Doc](https://docs.cometbft.com/v0.34/core/validators) should be reviewed, especially for running mainnet nodes.
There is a wealth of information there including configuration options, security, production readiness, and more.

:::

## Key Protection
Protecting a validator's consensus key is the most important factor to take in when designing your setup.
The key that a validator is given upon creation of the node is called a consensus key, it has to be online at
all times in order to vote on blocks. It is not recommended to merely hold your private key in the default json file
(priv_validator_key.json). Fortunately, the [Interchain Foundation](https://interchain.io/) has worked with a team to
build a key management server for validators. You can find documentation on how to use it [here](https://github.com/iqlusioninc/tmkms),
it is used extensively in production. You are not limited to using this tool, there are also HSMs.

### Key Types
A validator node will hold two/three types of keys.

#### Tendermint Consensus Key
The Tendermint consensus key is used to sign blocks on an ongoing basis. It is of the key type ed25519, which the KMS can keep. When Bech-encoded, the address is prefixed with `realiovalcons` and the public key is prefixed with `realiovalconspub`.

#### Node Key
The node key is for authenticating the connection. For instance, seed peers and persistent peers are authenticated using the node ID, which is generated from the node key.
By default, the node key is generated and stored in .realio-network/config/node_key.json in plaintext. One can get its node ID by running `realio-networkd tendermint show-node-id`
The security of the node key is not as important as the other two keys, because attacker would need to take over the IP addresses or domain names used for the node in order to forge the node's connection.

### Validator Operator Application Key
Operator key is for managing the application logic, e.g. delegation, editing validator commission rate, governance, etc.
This key is similar to a normal user's private key, except it has more permission on the validator.
When the operator key is initialized by realio-networkd keys add. When Bech-encoded, the address is prefixed with `realio` and the public key is prefixed with `realiopub`.


## Sentry Nodes

Validators are responsible for ensuring that the network can sustain denial-of-service attacks. One recommended way to mitigate these risks is for validators to carefully structure their network topology in a so-called sentry node architecture.

Validator nodes should only connect to full nodes they trust because they operate them themselves or are run by other validators they know socially. A validator node will typically run in a data center. Most data centers provide direct links to the networks of major cloud providers. The validator can use those links to connect to sentry nodes in the cloud. This shifts the burden of denial-of-service from the validator's node directly to its sentry nodes and may require new sentry nodes to be spun up or activated to mitigate attacks on existing ones.

Sentry nodes can be quickly spun up or change their IP addresses. Because the links to the sentry nodes are in private IP space, an internet-based attack cannot disturb them directly. This will ensure validator block proposals and votes always make it to the rest of the network.

:::tip

Read more about the Sentry Node concept on the [Cosmos Forum](https://forum.cosmos.network/t/sentry-node-architecture-overview/454)
:::

## Validator Backup

Backing up your validator's private key is essential to enable restoration in case of a disaster. The Tendermint Key, which is a distinct key utilized to endorse consensus votes, can only be retrieved through this backup method. If you're utilizing the default Tendermint signing method, "software sign," it's crucial to take note that your Tendermint key is situated at:
It is **crucial** to back up your validator's private key. It's the only way to restore your validator in the event of a disaster. The validator private key is a Tendermint Key: a unique key used to sign consensus votes.

```bash
~/.realio-networkd/config/priv_validator_key.json
```

:::warning 
It is not recommended to keep the priv_validator_key.json file hot in the server, especially in a mainnet node. It is recommended to use a key management server such as TMKMS or another strategy to keep the key offline.
:::