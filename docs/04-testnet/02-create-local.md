---
id: create-local
title: Create a local testnet
sidebar_label: Create Local
sidebar_position: 2
---

# Create a local testnet
:::warning Required realio-networkd executables  
You need to intall the [`realio-networkd` software](/fullnode/setup/#1-build-the-software) before going further.  
:::

You can create a single or multi node testnet. The instructions below are for a single node only:

## Creating a single node testnet
To create a single node local testnet, run the following commands:

:::tip Creating a local testnet  
If you prefer, there is an init.sh script in the public repo containing a script to start a single node network.
Please refer to the [_Init Script_](https://github.com/realiotech/realio-network/blob/main/init.sh).  
:::

```bash
   # example vars you may use:
   
    KEY="eduardo"
    CHAINID="realionetwork_9000-1"
    MONIKER="realionetworklocal"
    KEYRING="test"
    HOMEDIR="~/.realio-network"
    KEYALGO="eth_secp256k1"
    LOGLEVEL="trace"
    CHAINID="realionetwork_9000-1"
    MONIKER="realionetworklocal"
```

1. Initialize the local node:
   ```bash
   realio-networkd init $MONIKER --chain-id $CHAINID
   ```
   
2. Set Configs:
   ```bash
   realio-networkd config keyring-backend $KEYRING --home $HOMEDIR
   realio-networkd config chain-id $CHAINID --home $HOMEDIR 
   ```
3. Create a local key. Replace `$KEY` with whatever name you prefer.
   ```bash 
   realio-networkd keys add $KEY
   ```

   ```bash
   $ realio-networkd keys add $KEY --dry-run
   
   - name: eduardo
     type: local
     address: realio126cw9j2wy099lttf2qx0qds6k7t4kdea5ualh9
     pubkey: realiopub1addwnpepqdpfv4lh0vqjvmu43spz4lq0l92qret9hv6007j4r28z05wuthw2jz3frd4
     mnemonic: ""
     threshold: 0
     pubkeys: []
   
   
   **Important** write this mnemonic phrase in a safe place.
   It is the only way to recover your account if you ever forget your password.
   
   glory discover erosion mention grow prosper supreme term nephew venue pear eternal budget rely outdoor lobster strong sign space make soccer medal tuition patrol
   ```

   Make sure you save the shown mnemonic phrase in some safe place as it might return useful in the future.

4. Update genesis file module params:
   ```bash
     # updates the native bond denom to be ario (rio), adds support for rst, and sets demon metadata
     # the following commands below rely on `jq` being installed. You can check by running:
     # example jq install commands: See https://stedolan.github.io/jq/download/
    sudo apt-get install jq
    brew install jq
   
    cat $HOME/.realio-network/config/genesis.json | jq '.app_state["staking"]["params"]["bond_denom"]="ario,arst"' > $HOME/.realio-network/config/tmp_genesis.json && mv $HOME/.realio-network/config/tmp_genesis.json $HOME/.realio-network/config/genesis.json
    cat $HOME/.realio-network/config/genesis.json | jq '.app_state["mint"]["params"]["mint_denom"]="ario"' > $HOME/.realio-network/config/tmp_genesis.json && mv $HOME/.realio-network/config/tmp_genesis.json $HOME/.realio-network/config/genesis.json
    cat $HOME/.realio-network/config/genesis.json | jq '.app_state["crisis"]["constant_fee"]["denom"]="ario"' > $HOME/.realio-network/config/tmp_genesis.json && mv $HOME/.realio-network/config/tmp_genesis.json $HOME/.realio-network/config/genesis.json
    cat $HOME/.realio-network/config/genesis.json | jq '.app_state["gov"]["deposit_params"]["min_deposit"][0]["denom"]="ario"' > $HOME/.realio-network/config/tmp_genesis.json && mv $HOME/.realio-network/config/tmp_genesis.json $HOME/.realio-network/config/genesis.json
    cat $HOME/.realio-network/config/genesis.json | jq '.app_state["evm"]["params"]["evm_denom"]="ario"' > $HOME/.realio-network/config/tmp_genesis.json && mv $HOME/.realio-network/config/tmp_genesis.json $HOME/.realio-network/config/genesis.json
    cat $HOME/.realio-network/config/genesis.json | jq '.app_state["inflation"]["params"]["mint_denom"]="ario"' > $HOME/.realio-network/config/tmp_genesis.json && mv $HOME/.realio-network/config/tmp_genesis.json $HOME/.realio-network/config/genesis.json
    cat $HOME/.realio-network/config/genesis.json | jq '.app_state["bank"]["denom_metadata"]=[{ "description": "The native token of the Realio Network", "denom_units": [ { "denom": "ario", "exponent": 0, "aliases": [ "attorio" ] }, { "denom": "rio", "exponent": 18, "aliases": [] } ], "base": "ario", "display": "rio", "name": "Realio Network Rio", "symbol": "rio" }, { "description": "Realio Security Token", "denom_units": [ { "denom": "arst", "exponent": 0, "aliases": [ "attorst" ] }, { "denom": "rst", "exponent": 18, "aliases": [] } ], "base": "arst", "display": "rst", "name": "Realio Security Token", "symbol": "rst" }]' > $HOME/.realio-network/config/tmp_genesis.json && mv $HOME/.realio-network/config/tmp_genesis.json $HOME/.realio-network/config/genesis.json
   ```
   
6. Add genesis account, create and collect gen txs
   ```bash
   realio-networkd add-genesis-account $KEY 10000000000000000000000000ario
   realio-networkd gentx $KEY 100000000000000000000000ario --keyring-backend $KEYRING --chain-id $CHAINID
   realio-networkd collect-gentxs
   ```

7. Validate Genesis File:
   ```bash
      realio-networkd validate-genesis
   ```
   A valid file will output: "File at ____ is a valid genesis file" If an error is returned, the genesis file has a problem.

8. Start the testnet.  
   Once you have completed all the steps, you are ready to start your local testnet by running:
   ```bash
      realio-networkd start $TRACE --log_level $LOGLEVEL --minimum-gas-prices=0.0001ario --json-rpc.api eth,txpool,personal,net,debug,web3
   ```
