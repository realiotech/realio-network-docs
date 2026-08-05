---
id: ibc-info
title: IBC Info
sidebar_label: IBC Info
slug: ibc-info
---

# IBC info

To transfer to other chains in Cosmos ecosystem, you will need these channels' information.

### Osmosis
```bash
{
  "chain_1": {
    "chain_name": "osmosis",
    "chain_id": "osmosis-1",
    "client_id": "07-tendermint-2849",
    "connection_id": "connection-2361",
    "channel_id": "channel-1424",
    "port_id": "transfer"
  },
  "chain_2": {
    "chain_name": "realio",
    "chain_id": "realionetwork_3301-1",
    "client_id": "07-tendermint-1",
    "connection_id": "connection-1",
    "channel_id": "channel-1",
    "port_id": "transfer"
  },
  "ordering": "unordered"
}
```

### Cosmoshub
```bash
{
  "chain_1": {
    "chain_name": "cosmoshub",
    "chain_id": "cosmoshub-4",
    "client_id": "07-tendermint-1157",
    "connection_id": "connection-879",
    "channel_id": "channel-645",
    "port_id": "transfer"
  },
  "chain_2": {
    "chain_name": "realio",
    "chain_id": "realionetwork_3301-1",
    "client_id": "07-tendermint-2",
    "connection_id": "connection-2",
    "channel_id": "channel-2",
    "port_id": "transfer"
  },
  "ordering": "unordered"
}
```

:::tip 

If your IBC transfer is not working, you can ask on our [Discord Group](https://discord.gg/Nv9EUbRnKb).
:::