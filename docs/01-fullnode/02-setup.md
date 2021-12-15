---
id: setup
title: Setup
sidebar_position: 2
---

# Full node setup
Following you will find the instructions on how to manually setup your Realio Network full node.

:::warning Requirements
Before starting, make sure you read the [overview](overview) to make sure your hardware meets the needed
requirements.
:::

## 1. Build the software

:::tip Choose your DB backend
Before installing the software, a consideration must be done.

By default, Realio Network uses [LevelDB](https://github.com/google/leveldb) as its database backend engine. However, since
version `v0.6.0` we've also added the possibility of optionally
using [Facebook's RocksDB](https://github.com/facebook/rocksdb), which, although still being experimental, is known to
be faster and could lead to lower syncing times. If you want to try out RocksDB you can take a look at
our [RocksDB installation guide](04-rocksdb-installation.mdx) before proceeding further.
:::

In your terminal, run the following:

```bash
# Make sure we are inside the home directory
cd $HOME

# Clone the Realio Network software
git clone https://github.com/realiotech/realio-network.git && cd realio-network

# Checkout the correct tag
git checkout tags/v0.0.1

# Build the software
# If you want to use the default database backend run
make install

```

If the software is built successfully, the `realio-networkd` executable will be located inside your `$GOBIN` path. If you setup
your environment variables correctly in the previous step, you should also be able to run it properly. To check this,
try running:

```bash
realio-networkd version --long
```

## 2. Initialize the Realio Network working directory

Configuration files and chain data will be stored inside the `$HOME/.realio-network` directory by default. In order to create
this folder and all the necessary data we need to initialize a new full node using the `realio-network init` command.

Starting from `v0.15.0`, you are now able to provide a custom seed when initializing your node. This will be
particularly useful because, in the case that you want to reset your node, you will be able to re-generate the same
private node key instead of having to create a new node.

In order to provide a custom seed to your private key, you can do as follows:

1. Get a new random seed by running
   ```shell
   realio-networkd keys add node --dry-run

   # Example
   # realio-networkd keys add node --dry-run
   # - name: node
   #   type: local
   #   address: realio126cw9j2wy099lttf2qx0qds6k7t4kdea5ualh9
   #   pubkey: realiopub1addwnpepqdpfv4lh0vqjvmu43spz4lq0l92qret9hv6007j4r28z05wuthw2jz3frd4
   #   mnemonic: ""
   #   threshold: 0
   #   pubkeys: []
   #
   #
   # **Important** write this mnemonic phrase in a safe place.
   # It is the only way to recover your account if you ever forget your password.
   #
   # sort curious village display voyage oppose dice idea mutual inquiry keep swim team direct tired pink clinic figure tiny december giant obvious clump chest
   ```
   This will create a new key **without** adding it to your keystore, and output the underlying seed.

2. Run the `init` command using the `--recover` flag.
   ```shell
   realio-networkd init <your_node_moniker> --recover
   ```
   You can choose any `moniker` value you like. It will be saved in the `config.toml` under the `.realio-network/` working
   directory.

3. Insert the previously outputted secret recovery phrase (mnemonic phrase):
   ```
   > Enter your bip39 mnemonic
   sort curious village display voyage oppose dice idea mutual inquiry keep swim team direct tired pink clinic figure tiny december giant obvious clump chest
   ```

   This will generate the working files in `~/.realio-network`

   :::tip Tip
   By default, running `realio-networkd init <your_node_moniker>` without the `--recover` flag will randomly generate a `priv_validator_key.json`. There is no way to regenerate this key if you lose it.\
   We recommend running this command with the `--recover` so that you can regenerate the same `priv_validator_key.json` from the secret recovery phrase (mnemonic phrase).
   :::

## 3. Get the genesis file

To connect to an existing network, or start a new one, a genesis file is required. The file contains all the settings
telling how the genesis block of the network should look like.
 - If you are setting up a **testnet** node refer to this [procedure](../05-testnets/03-join-public/genesis-file.md);

## 4. Setup seeds

The next thing you have to do now is telling your node how to connect with other nodes that are already present on the
network. In order to do so, we will use the `seeds` and `persistent_peers` values of the `~/.realio-network/config/config.toml`
file.

Seed nodes are a particular type of nodes present on the network. Your fullnode will connect to them, and they will
provide it with a list of other fullnodes that are present on the network. Then, your fullnode will automatically
connect to such nodes. 
- If you are looking for **testnet** seeds please check here: [Testnet seeds](../05-testnets/03-join-public/seeds.md);

## 5. State sync

Realio Network has support for Tendermint'
s [state sync](https://docs.tendermint.com/master/nodes/state-sync.html#configure-state-sync). This feature allows new nodes to
sync with the chain extremely fast, by downloading snapshots created by other full nodes.
Here below, you can find the links to check for the correct procedure depending on which network you're setting up your node:
- If you are setting up state-sync for the **testnet** follow the [State sync testnet procedure](../05-testnets/03-join-public/state-sync.md);

### Changing state sync height
If you change the state sync height, you will need to perform these actions before trying to sync again:
* If you're running a **validator node**:
    1. Backup the `~/.realio-network/data/priv_validator_state.json`;
    2. Run `realio-networkd unsafe-reset-all`;
    3. Restore the `priv_validator_state.json` file.
    4. Restart the node.
* If you're running a *full node*:
    1. Run `realio-networkd unsafe-reset-all`;
    2. Restart the node.
    
## 6. (Optional) Edit snapshot config

Currently, the `snapshot` feature is enabled by the default. This means that your node will periodically create snapshots of the chain state and make them public, allowing other nodes to quickly join the network by syncing the application state at a given height.

By default, we have set Realio Network to take snapshots every 500 blocks, and persist the last 2 snapshots, deleting older ones. If you want to provide other nodes with more (or less) frequent snapshots, you can do this by editing a couple of things inside your `~/.realio-network/config/app.toml` file, under the `state-sync` section:

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

Your node uses vary different ports to interact with the rest of the chain. Particularly, it relies on:

- port `26656` to listen for incoming connections from other nodes;
- port `26657` to expose the RPC service to clients.

A part from those, it also uses:

- port `9090` to expose the [gRPC](https://grpc.io/) service that allows clients to query the chain state;
- port `1317` to expose the REST APIs service.

While opening any ports are optional, it is beneficial to the whole network if
you open port `26656`. This would allow new nodes to connect to you as a peer, making them sync faster and the connections more reliable.

For this reason, we will be opening port `26656` using `ufw`. \
By default, `ufw` is not enabled. In order to enable it please run the following:

```bash
# running this should show it is inactive
sudo ufw status

# Turn on ssh if you need it
sudo ufw allow ssh

# Accept connections to port 26656 from any address
sudo ufw allow from any to any port 26656 proto tcp

# enable ufw
sudo ufw enable

# check ufw is running
sudo ufw status
```

If you also want to run a gRPC server, RPC node or the REST APIs, you also need to remember to open the related ports as
well.

## 8. Start the Realio Network node

After setting up the binary and opening up ports, you are now finally ready to start your node:

```bash
# Run Realio Network full node
realio-networkd start
```

The full node will connect to the peers and start syncing. You can check the status of the node by executing:

```bash
# Check status of the node
realio-networkd status
```

You should see an output like the following one:

```json
{
   "NodeInfo":{
      "protocol_version":{
         "p2p":"8",
         "block":"11",
         "app":"0"
      },
      "id":"e717a45df9a4478024afc2a4a3571200e3221499",
      "listen_addr":"tcp://0.0.0.0:26656",
      "network":"realionetwork-test",
      "version":"0.34.12",
      "channels":"40202122233038606100",
      "moniker":"realio-test-1",
      "other":{
         "tx_index":"on",
         "rpc_address":"tcp://127.0.0.1:26657"
      }
   },
   "SyncInfo":{
      "latest_block_hash":"457499C2081F6942AABFB0DB7CB14ED158D88134C4F194E9BD6953ACAEC75B39",
      "latest_app_hash":"CF951E52FED3C1270AD68FD79DB5383C002D0DC4BC7E99C77C86577662A0087E",
      "latest_block_height":"106993",
      "latest_block_time":"2021-12-14T23:04:45.750931036Z",
      "earliest_block_hash":"ABCA05731B673E9475C1656CEF141FA675492373FDF22BFFB1F2B10E02BFA624",
      "earliest_app_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "earliest_block_height":"1",
      "earliest_block_time":"2021-12-07T18:01:27.364749213Z",
      "catching_up":false
   },
   "ValidatorInfo":{
      "Address":"ABF91465BA3AF87164951301BDB1CA47B768504B",
      "PubKey":{
         "type":"tendermint/PubKeyEd25519",
         "value":"66pFX35wrd/nXwncpvtViuJ8UhOXKp32oxOSDH2qC1E="
      },
      "VotingPower":"10"
   }
}
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

After your node is fully synced, you can consider running your full node as a [validator node](../04-validators/02-setup.md).

## 9. (Optional) Configure the background service

To allow your `realio network node` instance to run in the background as a service you need to execute the following command

```bash
vim /etc/systemd/system/realio-network.service > /dev/null <<EOF
[Unit]
Description=Realio Network Full Node
After=network-online.target

[Service]
User=$USER
ExecStart=$GOBIN/realio-networkd start
Restart=always
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

Once you have successfully created the service, you need to enable it. You can do so by running

```bash
systemctl enable realio-networkd
```

After this, you can run it by executing

```bash
systemctl start realio-networkd
```

### Service operations

#### Check the service status
If you want to see if the service is running properly, you can execute

```bash
systemctl status realio-networkd
```

If everything is running smoothly you should see something like

```bash
$ systemctl status realio-networkd
● realio-networkd.service - Realio Network Full Node
   Loaded: loaded (/etc/systemd/system/realio-networkd.service; enabled; vendor preset:
   Active: active (running) since Wed 2021-12-08 17:54:59 UTC; 3 sec ago
 Main PID: 160776 (realio-networkd)
    Tasks: 9 (limit: 1136)
   Memory: 296.4M
   CGroup: /system.slice/realio-networkd.service
           └─11318 /root/go/bin/realio-networkd start
```

#### Check the node logs
If you want to see the current logs of the node, you can do so by running

```bash
journalctl -u realio-networkd -f
```

#### Stopping the service
If you wish to stop the service from running, you can do so by running

```bash
systemctl stop realio-networkd
```

To check the successful stop, execute `systemctl status realio-networkd`. This should return

```bash
$ systemctl status realio-networkd
● realio-networkd.service - Realio Network Full Node
   Loaded: loaded (/etc/systemd/system/realio-networkd.service; enabled; vendor preset: enabled)
   Active: failed (Result: exit-code) since Wed 2021-12-08 17:54:59 UTC; 3 sec ago
  Process: 160776 ExecStart=/root/go/bin/realio-networkd start (code=exited, status=143)
 Main PID: 160776 (code=exited, status=143)
```

## 9. Cosmovisor
In order to do automatic on-chain upgrades we will be using cosmovisor. Please check out [Using Cosmovisor](05-cosmovisor.md) for information on how to set this up.
