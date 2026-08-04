---
id: state-sync
title: State Sync
sidebar_label: State Sync
slug: state-sync
---

# State sync

In order to use this feature, you will have to edit a couple of things inside your `~/.realionetwork/config/config.toml` file,
under the `statesync` section:

1. Enable state sync by setting `enable=true`

2. Set the RPC addresses from where to get the snapshots using the `rpc_servers` field:
    - See Peer & Seeds information in order to get RPC addresses in our [discord group](https://discord.gg/Nv9EUbRnKb)

3. Get a trusted chain height, and the associated block hash. To do this, you will have to:
    - Get the current chain height by running:
       ```bash
       curl -s <rpc-endpoint>/commit | jq "{height: .result.signed_header.header.height}"
       ```
    - Once you have the current chain height, get a height that is a little lower (200 blocks) than the current one.  
      To do this you can execute:
       ```bash
       curl -s <rpc-endpoint>/commit?height=<your-height> | jq "{height: .result.signed_header.header.height, hash: .result.signed_header.commit.block_id.hash}"
 
       # Example
       # curl -s <rpc-endpoint>/commit?height=100000 | jq "{height: .result.signed_header.header.height, hash: .result.signed_header.commit.block_id.hash}"
       ```

    - Now that you have a trusted height and block hash, use those values as the `trust_height` and `trust_hash` values. Also,
      make sure they're the right values for the Realio Network version you're starting to synchronize:

      **State sync height range** | **RealioNetwork version** |
      |:--------------------------|:--------------------------|
      | `0 - 1235764`               | `v0.9.2`                  |

    - Here is an EXAMPLE (no not copy!) of what the `statesync` section of your `~/.realionetwork/config/config.toml` file should look like in the end (the `trust_height` and `trust_hash` should contain your values instead):

      ```toml
        enable = true
    
        rpc_servers = "0.0.0.0:26657"
        trust_height = 100
        trust_hash = "E8ED7A890A64986246EEB02D7D8C4A6D497E3B60C0CAFDDE30F2EE385204C314"
        trust_period = "336h0m0s"
      ```

4. Add peers to `~/.realionetwork/config/config.toml` file:

:::tip

Our discord group is a great source for getting peer information from the community. After joining the [Discord Group](https://discord.gg/Nv9EUbRnKb),
look for the #testnet-seeds-peers channel or the #mainnet-seeds-peers channel and ask the current members for one if needed.
:::

Add these seeds here to the `~/.realionetwork/config/config.toml` file

```toml
seeds = "....." 
peers = "....."
```
