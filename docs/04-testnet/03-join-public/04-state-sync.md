---
id: state-sync
title: State Sync
sidebar_label: State Sync
slug: state-sync
---

# State sync testnet
:::caution Testnet only   
The following seed nodes are to be used when configuring a full node for the **testnet**. If you are looking for mainnet seed nodes, please refer to [this](/mainnet/overview) instead.
:::

In order to use this feature, you will have to edit a couple of things inside your `~/.realionetwork/config/config.toml` file,
under the `statesync` section:

1. Enable state sync by setting `enable=true`

2. Set the RPC addresses from where to get the snapshots using the `rpc_servers` field to
   `seed-1.test.realio.network:26657,seed-2.test.realio.network:26657`.   
   These are two of our fullnodes that are set up to create periodic snapshots every 600 blocks;

3. Get a trusted chain height, and the associated block hash. To do this, you will have to:
    - Get the current chain height by running:
       ```bash
       curl -s http://seed-1.test.realio.network:26657/commit | jq "{height: .result.signed_header.header.height}"
       ```
    - Once you have the current chain height, get a height that is a little lower (200 blocks) than the current one.  
      To do this you can execute:
       ```bash
       curl -s http://seed-1.test.realio.network:26657/commit?height=<your-height> | jq "{height: .result.signed_header.header.height, hash: .result.signed_header.commit.block_id.hash}"
 
       # Example
       # curl -s http://seed-1.test.realio.network:26657/commit?height=100000 | jq "{height: .result.signed_header.header.height, hash: .result.signed_header.commit.block_id.hash}"
       ```

    - Now that you have a trusted height and block hash, use those values as the `trust_height` and `trust_hash` values. Also,
       make sure they're the right values for the Realio Network version you're starting to synchronize:

       | **State sync height range** | **RealioNetwork version** |
             |:--------------------------|:---------------------------|
       | `0 - 1235764`               | `v0.17.0`                 |
       
    - Here is an example of what the `statesync` section of your `~/.realionetwork/config/config.toml` file should look like in the end (the `trust_height` and `trust_hash` should contain your values instead):
    
      ```toml
        enable = true
    
        rpc_servers = "seed-1.test.realio.network:26657,seed-2.test.realio.network:26657"
        trust_height = 16962
        trust_hash = "E8ED7A890A64986246EEB02D7D8C4A6D497E3B60C0CAFDDE30F2EE385204C314"
        trust_period = "336h0m0s"
      ```

4. Add peers to `~/.realionetwork/config/config.toml` file:

 ```toml
persistent_peers = "67dcef828fc2be3c3bcc19c9542d2b228bd7cff9@seed-1.test.realio.network:26656,fcf8207fb84a7238089bd0cd8db994e0af9016b6@seed-2.test.realio.network:26656"
 ```
