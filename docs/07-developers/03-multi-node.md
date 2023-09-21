---
id: multi-node
title: Multi Node
sidebar_label: Multi Node
slug: multi-node
---

# Multi Node

## Pre-requisite Readings

- [Install Docker](https://docs.docker.com/engine/installation/)  
- [Install docker-compose](https://docs.docker.com/compose/install/)

## Automated Localnet with Docker

### Build & Start

To build start a 4 node testnet run:

```bash
make localnet-start
```

This command creates a 4-node network using the `realio-network/node` Docker image.
The ports for each node are found in this table:

| Node ID              | P2P Port | Tendermint RPC Port | REST/ Ethereum JSON-RPC Port | WebSocket Port |
|----------------------|----------|---------------------|------------------------------|----------------|
| `realionetworknode0` | `26656`  | `26657`             | `8545`                       | `8546`         |
| `realionetworknode1` | `26659`  | `26660`             | `8547`                       | `8548`         |
| `realionetworknode2` | `26661`  | `26662`             | `8549`                       | `8550`         |
| `realionetworknode3` | `26663`  | `26664`             | `8551`                       | `8552`         |

To update the binary, just rebuild it and restart the nodes

```bash
make localnet-start
```

The command above command will run containers in the background using Docker compose.
You will see the network being created:

```bash
...
Network realio-network_localnet  Created 
Container realionetworknode1     Started
Container realionetworknode2     Started
Container realionetworknode3     Started
Container realionetworknode4     Started
```

### Stop Localnet

Once you are done, execute:

```bash
make localnet-stop
```

### Configuration

The `make localnet-start` creates files for a 4-node testnet in `./build` by
calling the `realio-networkd testnet` command. This outputs a handful of files in the
`./build` directory:

```bash
tree -L 3 build/

build/
├── gentxs
│   ├── node0.json
│   ├── node1.json
│   ├── node2.json
│   └── node3.json
├── node0
│   └── realio-network
│       ├── config
│       ├── data
│       ├── key_seed.json
│       └── keyring-test
├── node1
│   └── realio-network
│       ├── config
│       ├── data
│       ├── key_seed.json
│       └── keyring-test
├── node2
│   └── realio-network
│       ├── config
│       ├── data
│       ├── key_seed.json
│       └── keyring-test
└── node3
    └── realio-network
        ├── config
        ├── data
        ├── key_seed.json
        └── keyring-test
```

Each `./build/nodeN` directory is mounted to the `/realio-network` directory in each container.

### Logging

In order to see the logs of a particular node you can use the following command:

```bash
# node 0: daemon logs
docker logs -f realionetworkdnode0 

# node 0: REST & RPC logs
docker logs -f realionetworkdnode0 
```

The logs for the daemon will look like:

```bash
5:51PM INF committed state app_hash=01BD395F3D7A0A2B2601FC15FD7A748113C9603B6A05077254E5F504F41834DA height=2132 module=state num_txs=0 server=node
5:51PM INF indexed block exents height=2132 module=txindex server=node
5:51PM INF Timed out dur=4967.643333 height=2133 module=consensus round=0 server=node step=1
5:51PM INF received proposal module=consensus proposal={"Type":32,"block_id":{"hash":"4131DC109A4ACDB86EE59BAEF6C8707086C635714F45708BF2C404B56C737997","parts":{"hash":"D98409510752B9DEFCDDE0B42A66BD32B2B692B1883A9C49B8A2AA5F2A252BC4","total":1}},"height":2133,"pol_round":-1,"round":0,"signature":"odESEDdwDiRNgen4Y+Jx/F4wpG/FIRN7oY2wveFBWrZOkMD3t92L7lVsQpd5CMgkvn9zeu1iy10gvQkE/xwwBg==","timestamp":"2023-01-31T17:51:58.294421217Z"} server=node
5:51PM INF received complete proposal block hash=4131DC109A4ACDB86EE59BAEF6C8707086C635714F45708BF2C404B56C737997 height=2133 module=consensus server=node
5:51PM INF finalizing commit of block hash={} height=2133 module=consensus num_txs=0 root=01BD395F3D7A0A2B2601FC15FD7A748113C9603B6A05077254E5F504F41834DA server=node
5:51PM INF minted coins from module account amount=1544726445327498634stake from=mint module=x/bank
5:51PM INF executed block height=2133 module=state num_invalid_txs=0 num_valid_txs=0 server=node
5:51PM INF commit synced commit=436F6D6D697449447B5B35362034372032303020323339203535203234352037203635203234322032313920323320353220382031343620323433203132332032343520313437203136342037312038203135372032303820323420313033203234362031323920323231203938203120313032203136305D3A3835357D
5:51PM INF committed state app_hash=382FC8EF37F50741F2DB17340892F37BF593A447089DD01867F681DD620166A0 height=2133 module=state num_txs=0 server=node
```

Whereas the logs for the REST & RPC server would look like:

```bash
I[2020-07-30|09:39:17.488] Starting application REST service (chain-id: "7305661614933169792")... module=rest-server
I[2020-07-30|09:39:17.488] Starting RPC HTTP server on 127.0.0.1:8545   module=rest-server
...
```

### Interact with the Localnet

#### Ethereum JSON-RPC & Websocket Ports

To interact with the testnet via WebSockets or RPC/API, you will send your request to the corresponding ports:

| EVM JSON-RPC | Eth Websocket |
|--------------|---------------|
| `8545`       | `8546`        |

You can send a curl command such as:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' -H "Content-Type: application/json" 192.162.10.1:8545
```

:::tip
The IP address will be the public IP of the docker container.
:::


### Keys & Accounts

To interact with ` realio-networkd` and start querying state or creating txs, you use the
` realio-network` directory of any given node as your `home`, for example:

```bash
 realio-networkd keys list --home ./build/node0/realio-network
```

Now that accounts exists, you may create new accounts and send those accounts
funds!

:::tip
**Note**: Each node's seed is located at `./build/nodeN/realio-network/key_seed.json`
and can be restored to the CLI using the `realio-networkd keys add --restore` command
:::

### Special Binaries

If you have multiple binaries with different names,
you can specify which one to run with the BINARY environment variable.
The path of the binary is relative to the attached volume.
For example:

```bash
# Run with custom binary
BINARY=realio-networkd make localnet-start
```