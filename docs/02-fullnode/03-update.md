---
id: update
title: Update
sidebar_label: Update
sidebar_position: 3
slug: update
---

# Upgrade your Realio Network full node
These instructions are for full nodes that are running on previous versions of RealioNetwork and need to update to the latest version of the RealioNetwork software.

## Manual upgrade
The following instructions explain how to **manually upgrade** the node:

1. Stop your node:  
   ```bash 
    sudo systemctl stop realio-networkd
   ```

2. Backup your validator files:
   ```bash 
   cp ~/.realio-network/config/priv_validator_key.json ~/priv_validator_key.json
   cp ~/.realio-network/config/node_key.json ~/node_key.json
   cp ~/.realio-network/data/priv_validator_state.json ~/priv_validator_state.json
   ```

3. Go into the directory in which you have installed the `Realio Network` repo. If you have followed
   the installation instructions and didn't change the path, it should be `/home/$USER/realio-network`:
    ```bash
    cd <installation-path> 

    # e.g.
    # cd ~/realio-network
    ```

4. Now, update the `realio-networkd` software:
    ```bash
    git fetch --tags
    git checkout tags/$(git describe --tags `git rev-list --tags --max-count=1`)
    make build && make install
    ```

:::tip Select the version you need  
The above commands checks out the latest release that has been tagged on our repository. If you wish to check out a specific version instead, use the following commands:

1. List all the tags:
   ```bash
   git tags --list
   ```

2. Checkout the tag you want:
   ```bash
   git checkout tags/<tag>
   # Example: git checkout tags/v4.1.0
   ```
:::

:::tip Note   
If you have issues at this step, please check that you have the [latest stable version](https://golang.org/dl/) of Go installed.  
:::

### Cosmovisor

:::caution
If your node is using cosmovisor, and you've followed the above procedure to manually upgrade, don't forget to move the upgraded binary inside the cosmovisor folder by typing the following command:

```bash
cp build/realio-networkd ~/.realio-network/cosmovisor/current/bin/realio-networkd
```

Then check if the version of cosmovisor matches with the latest realio-networkd version by running:
```bash
cosmovisor version
```
:::

## Automatic upgrade (with Cosmovisor)
Below it is explained how to prepare your node to be able to **automatically upgrade** itself.

Cosmovisor handles the automatic upgrades that happens after the _upgrade governance proposal_ passes.
If during an upgrade your node doesn't have enough space left or if the cosmovisor backup it is taking too much
time, you can do the following:
1. Open your `realio-networkd` editor:
   ```bash
   sudo systemctl edit realio-networkd --full
   ``` 
1. Add the following line after the last `Environment` line:
   ```bash
    Environment="UNSAFE_SKIP_BACKUP=true"
   ```
