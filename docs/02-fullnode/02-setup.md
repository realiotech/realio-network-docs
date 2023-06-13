---
id: setup
title: Setup
sidebar_position: 2
---

# Full node setup
Below you will find the instructions on how to manually setup your Realio Network full node.

:::warning Requirements
Before starting, make sure you read the [overview](overview) to make sure your hardware meets the necessary
requirements.
:::

## 1. Build the software

In your terminal, run the following:

```bash
# Make sure we are inside the home directory
cd $HOME

# Clone the Realio Network software
git clone https://github.com/realiotech/realio-network.git && cd realio-network

# Checkout the correct tag
git checkout tags/v0.8.2

# Build the software
# If you want to use the default database backend run
make install

```

If the software is built successfully, the `realio-networkd` executable will be located inside your `$GOBIN` path. If you setup
your environment variables correctly in the previous step, you should also be able to run it properly. To check this,
try running:

```bash
realio-networkd version --long

# example output:
...
name: realionetwork
server_name: realio-networkd
version: 0.8.2
commit: ed56a997ab2d9391fb7781acd6d9c4d3b73a202a
go: go version go1.20 linux/amd64

```

## 2. Initialize the Realio Network working directory

Configuration files and chain data will be stored inside the `$HOME/.realio-network` directory by default. In order to create
this folder and all the necessary data we need to initialize a new full node using the `realio-network init` command.

Starting from `v0.15.0`, you are now able to provide a custom seed when initializing your node. This will be
particularly useful because, in the case that you want to reset your node, you will be able to re-generate the same
private node key instead of having to create a new node.

In order to provide a custom seed to your private key, you can do as follows:

1. Get a new random seed by running:
   ```shell
   realio-networkd keys add node --dry-run

    # Example
    # realio-networkd keys add node --dry-run
    # - name: node
    #   type: local
    #   address: realio1r0enplsg8sxf44nsx0tehs80garxju98kdyegs
    #   pubkey: '{"@type":"/ethermint.crypto.v1.ethsecp256k1.PubKey","key":"A95JbKv+qWRcxFzJ6xB/loe3jb8OcBtTLyOYZeAGjoC6"}'
    #   mnemonic: ""
    #
    #
    # **Important** write this mnemonic phrase in a safe place.
    # It is the only way to recover your account if you ever forget your password.
    #
    # sort draw stumble motor fuel cement grain drip keep swim team direct tired pink clinic figure tiny december giant obvious clump chest
   ```
   This will create a new key **without** adding it to your keystore, and output the underlying seed.

2. Run the `init` command using the `--recover` flag:
   ```shell
   realio-networkd init <your_node_moniker> --recover --chain-id <the_chain_id>
   ```
   You can choose any `moniker` value you like. It is a public name for the node such as 'world-node-1', and will be saved in the `config.toml` under the `.realio-network/` working
   directory.

3. Insert the previously outputted secret recovery phrase (mnemonic phrase):
   ```
   > Enter your bip39 mnemonic
   sort curious village display voyager oppose dice idea mutual inquiry keep swim team direct tired pink clinic figure tiny december giant obvious clump chest
   ```

   This will generate the working files in `~/.realio-network`

   :::tip Tip
   By default, running `realio-networkd init <your_node_moniker>` without the `--recover` flag will randomly generate a `priv_validator_key.json`. There is no way to regenerate this key if you lose it.\
   We recommend running this command with the `--recover` so that you can regenerate the same `priv_validator_key.json` from the secret recovery phrase (mnemonic phrase).
   :::

## 3. Get the genesis file

To connect to an existing network, or start a new one, a genesis file is required. The file contains all the settings
telling how the genesis block of the network should look like.
 - If you are setting up a **testnet** node refer to this [procedure](/testnet/join-public/genesis-file)
 - If you are setting up a **mainnet** node refer to this [procedure](/mainnet/genesis-file)

## 4. Setup seeds

Next, you'll need to tell your node how to connect with other nodes that are already present on the network. 
In order to do so, you will use the `seeds` and `persistent_peers` values of the `~/.realio-network/config/config.toml`
file.

A seed node is a node who relays the addresses of other peers which they know of. These nodes constantly crawl the 
network to try to get more peers. The addresses which the seed node relays get saved into a local address book. Once 
these are in the address book, you will connect to those addresses directly. 

- If you are looking for **testnet** seeds please check here: [Testnet seeds](/testnet/join-public/seeds)
- If you are looking for **mainnet** seeds please check here: [Mainnet seeds](/mainnet/seeds)

## 5. State sync

The Realio Network has support for Tendermint's [state sync](https://docs.tendermint.com/v0.34/tendermint-core/state-sync.html). This feature allows new nodes to
sync with the chain extremely fast, by downloading snapshots created by other full nodes.
Here below, you can find the links to check for the correct procedure depending on which network you're setting up your node:
- If you are setting up state-sync for the **testnet** follow the [State sync testnet procedure](/testnet/join-public/state-sync).

### Changing state sync height
If you change the state sync height, you will need to perform these actions before trying to sync again:
* If you're running a **validator node**:
    1. Backup the `~/.realio-network/data/priv_validator_state.json`;
    2. Run `realio-networkd unsafe-reset-all`;
    3. Restore the `priv_validator_state.json` file.
    4. Restart the node.
* If you're running a **full node**:
    1. Run `realio-networkd unsafe-reset-all`;
    2. Restart the node.
    
## 6. (Optional) Edit snapshot config

Currently, the `snapshot` feature is disabled by the default. If it is enabled, your node will periodically create snapshots of the chain state and make them public, allowing other nodes to quickly join the network by syncing the application state at a given height.

If you want to provide other nodes with snapshots, you can do this by editing a couple of things inside your `~/.realio-network/config/app.toml` file, under the `state-sync` section:

```toml
# snapshot-interval specifies the block interval at which local state sync snapshots are
# taken (0 to disable). Must be a multiple of pruning-keep-every.
snapshot-interval = 500

# snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all).
snapshot-keep-recent = 2
```

**Note: Make sure that snapshot-interval is a multiple of `pruning-keep-every` in the `base` section**

```toml
pruning-keep-recent = "100"
pruning-keep-every = "500"
pruning-interval = "10"
```

You can find out more about pruning [here](01-overview.mdx#understanding-pruning).

## 7. Open the proper ports

Now that everything is in place to start the node, the last thing to do is to open up the proper ports.

Your node uses various different ports to interact with the rest of the chain. Particularly, it relies on:

- port `26656` to listen for incoming connections from other nodes;
- port `26657` to expose the Tendermint RPC service to clients.

A part from those, it also uses:

- port `9090` to expose the [gRPC](https://grpc.io/) service that allows clients to query the chain state;
- port `1317` to expose the REST APIs service.
- port `8545` Ethereum JSON-RPC to query Ethereum-formatted transactions and blocks or send Ethereum txs using JSON-RPC
- port `8546` Ethereum Websocket to subscribe to Ethereum logs and events emitted in smart contracts.

While opening any ports are optional, it is beneficial to the whole network if
you open port `26656`. This would allow new nodes to connect to you as a peer, making them sync faster and the connections more reliable.

For this reason, we will be opening port `26656` using `ufw`.
By default, `ufw` is not enabled. In order to enable it please run the following:

```bash
# running this should show it is inactive
sudo ufw status

# Turn on ssh if you need it
sudo ufw allow ssh

# Accept connections on the ports listed above.
# Some are optional depending on the usage of the node.
sudo ufw allow from any to any port 26656 proto tcp
sudo ufw allow from any to any port 26657 
sudo ufw allow from any to any port 1317 
sudo ufw allow from any to any port 9090
sudo ufw allow from any to any port 8545
sudo ufw allow from any to any port 8546

# enable ufw
sudo ufw enable

# check ufw is running
sudo ufw status
```

A note on the optionality of some of the ports: You do not need to open 8545 for example if you are not exposing the 
ETH JSON RPC. Our discord channel is a good place to ask about this. 

## 8. Start the Realio Network node

After setting up the binary and opening up ports, you are now finally ready to start your node:

```bash
# Run Realio Network full node basic start command
realio-networkd start

# Run Realio Network full node with options
realio-networkd start --log_level info --minimum-gas-prices=0.0001ario --json-rpc.api eth,txpool,personal,web3....

# help command
realio-networkd start --help


```

The full node will connect to the peers and start syncing. You can check the status of the node by executing:

```bash
# Check status of the node
realio-networkd status
```

You should see an output like the following one:

```json
{"NodeInfo":{"protocol_version":{"p2p":"8","block":"11","app":"0"},"id":"904ee3c96547fb33c5e3112bdd5d292f2c53efd2","listen_addr":"tcp://0.0.0.0:26656","network":"realionetworktest_2022-1","version":"0.34.19","channels":"40202122233038606100","moniker":"realio-val-1","other":{"tx_index":"on","rpc_address":"tcp://0.0.0.0:26657"}},"SyncInfo":{"latest_block_hash":"0725BD0D5802C85917C94024D4C704DEBFB6E11F807DD0EE40E993C7F4F8E47C","latest_app_hash":"553BDF06736EA04584B89257E65DA5A385160F0C7FF9FB03DD8CB940E8AA5049","latest_block_height":"580978","latest_block_time":"2022-09-25T15:53:06.040173319Z","earliest_block_hash":"267AC75E85FE5E68DB927D8D4C3DFFE68C1AC9746F5DAE6C10D73B7B428CBFC2","earliest_app_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855","earliest_block_height":"1","earliest_block_time":"2022-08-22T14:04:58.282183469Z","catching_up":false},"ValidatorInfo":{"Address":"F137086F1A90EB4AB4696980F11F1FED703E8C00","PubKey":{"type":"tendermint/PubKeyEd25519","value":"yYG/hdRMITlG/4AC4ASA9pQMprHPor5ttE+WdZbXCew="},"VotingPower":"1000000"}}
```

If you see that the `catching_up` value is `false` under the `sync_info`, it means that you are fully synced. If it
is `true`, it means your node is still syncing. You can get the `catching_up` value by simply running:

```shell
realio-networkd status 2>&1 | jq "{catching_up: .SyncInfo.catching_up}"

# Example
# $ realio-networkd status 2>&1 | jq "{catching_up: .SyncInfo.catching_up}"
# {
#   "catching_up": false
# }
```

After your node is fully synced, you can consider running your full node as a [validator node](/validators/setup).

## 9. (Optional) Configure the background service

To allow your `realio network node` instance to run in the background as a service you need to execute the following command:

```bash
# sudo vim /etc/systemd/system/realio-network.service

[Unit]
Description=Realio Network Full Node
After=network-online.target

[Service]
User=$USER
ExecStart=/path/to/gobin/realio-networkd start
Restart=always
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target

```

Once you have successfully created the service, you need to enable it. You can do so by running:

```bash
systemctl enable realio-network
```

After this, you can run it by executing:

```bash
systemctl start realio-network
```

### Service operations

#### Check the service status
If you want to see if the service is running properly, you can execute

```bash
sudo systemctl status realio-network
```

If everything is running smoothly you should see something like

```bash
$ systemctl status realio-network
● realio-network.service - Realio Network Full Node
   Loaded: loaded (/etc/systemd/system/realio-networkd.service; enabled; vendor preset:
   Active: active (running) since Wed 2021-12-08 17:54:59 UTC; 3 sec ago
 Main PID: 160776 (realio-networkd)
    Tasks: 9 (limit: 1136)
   Memory: 296.4M
   CGroup: /system.slice/realio-networkd.service
           └─11318 /root/go/bin/realio-networkd start
```

#### Check the node logs
If you want to see the current logs of the node, you can do so by running the command:

```bash
sudo journalctl -u realio-network -f
```

If you do not see any log output, and the status command above returns no errors, try restarting the journalctl daemon:
```bash
sudo systemctl restart systemd-journald
```

#### Stopping the service
If you wish to stop the service from running, you can do so by running

```bash
sudo systemctl stop realio-network
```

To check the successful stop, execute `systemctl status realio-network`. This should return

```bash
$ systemctl status realio-network
● realio-network.service - Realio Network Full Node
   Loaded: loaded (/etc/systemd/system/realio-network.service; enabled; vendor preset: enabled)
   Active: failed (Result: exit-code) since Wed 2021-12-08 17:54:59 UTC; 3 sec ago
  Process: 160776 ExecStart=/root/go/bin/realio-network start (code=exited, status=143)
 Main PID: 160776 (code=exited, status=143)
```

## 10. Cosmovisor
In order to do automatic on-chain upgrades we will be using cosmovisor. Please check out [Using Cosmovisor](04-cosmovisor.md) for information on how to set this up.
