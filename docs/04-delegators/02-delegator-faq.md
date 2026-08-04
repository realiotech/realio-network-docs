---
id: faq
title: F.A.Q
sidebar_label: Delegator FAQ
slug: delegator-faq
---

# Delegator FAQ

## Terminology

### What is a delegator?
Delegators are Realio Network tokens holders who cannot, or do not want to run a validator themselves. Token holders can delegate Realio Network tokens to a validator and obtain a part of their revenue in exchange (for more detail on how revenue is distributed, see [What is the incentive to stake?](/validators/validator-faq/#what-is-the-incentive-to-stake) and [What are validators commission?](/validators/validator-faq/#what-are-validators-commission) sections below).

Because they share revenue with their validators, delegators also share risks. Should a validator misbehave, each of their delegators will be partially slashed in proportion to their delegated stake. This is why delegators should perform due diligence on validators before delegating, as well as spreading their stake over multiple validators.

Delegators play a critical role in the system, as they are responsible for choosing validators. Being a delegator is not a passive role: delegators should actively monitor the actions of their validators and participate in governance.

### What is a validator?
[The Realio Network](../..) is based on [CometBFT](https://docs.cometbft.com/v0.34/introduction/what-is-cometbft), which
relies on a set of validators to secure the network. The role of validators is to run a full node and participate in
consensus by broadcasting votes which contain cryptographic signatures signed by their private key. Validators commit
new blocks in the blockchain and receive revenue in exchange for their work. They must also participate in governance by
voting on proposals. Validators are weighted according to their total stake.

### Delegating / Undelegating / Redelegating
  - **Delegating**: Giving funds to someone else and earning rewards for having your funds delegated. Delegators are Realio Network token holders who cannot or do not want to run a validator themselves. Token holders can delegate Realio Network tokens to a validator and obtain a part of their revenue in exchange. Delegators play a critical role in the system, as they are responsible for choosing validators.
  - **Undelegating (unbonding)**: Requesting funds back that have been delegated. There is a 7-day unbonding period before your funds are available.
  - **Redelegating**: Allowing you to change delegation from one validator to another without waiting for the 7-day unbonding period.

## Delegating FAQs

### What role does a delegator play?
Delegators play a crucial role in maintaining the security and decentralization of the Realio Network by supporting validators they trust. By delegating their tokens to a chosen
validator, delegators are increasing the validators power in the network and entrusting them to secure the network on their behalf.

### What is the role of the validator?
Validators are responsible for proposing and validating new blocks on the blockchain.

### What are the benefits of delegating?
When you delegate your RST or RIO to a validator, you help secure the network and receive RIO rewards.

### Are there risks associated with delegating?
Delegation on the Realio Network carries risks, including validator slashing for protocol violations or downtime. 
If a validator misbehaves, their delegated stake will be partially slashed.
There are currently two faults that can result in the slashing of funds for a validator and their delegators:
- **Double signing**: If someone reports on chain A that a validator signed two blocks at the same height on chain A and chain B, and if chain A and chain B share a common ancestor, then this validator will get slashed by 5% on chain A.
- **Downtime**: If a validator misses more than 95% of the last 10.000 blocks, they will get slashed by 0.01%.

### How do I delegate?
To delegate, review our [step-by-step guide.](https://www.realio.fund/blog/realio-network-staking-guide)

### Can I delegate RIO to an RST validator or RST to RIO validator?
No, you can only delegate RIO to a RIO validator and RST to a RST validator.

### What should I consider before selecting a validator?
- Delegators are free to choose validators according to their own subjective criteria. This said criteria anticipated to be important include:
- Amount of self-delegated RIO/RST tokens: Number of RIO/RST tokens a validator self-delegated to themselves. A validator with more self-delegated RIO/RST tokens has more skin in the game, making them more liable for their actions.
- Amount of delegated RIO/RST tokens: Total number of RIO/RST tokens delegated to a validator. A high voting power shows that the community trusts this validator, but it also means that this validator is a bigger target for hackers. Bigger validators also decrease the decentralization of the network.
- Commission rate: Commission applied on revenue by validators before it is distributed to their delegators.
- Track record: Delegators will likely look at the track record of the validators they plan to delegate. This includes seniority, past votes on proposals, historical average uptime, and how often the node was compromised.
- Apart from these criteria, there will be a possibility for validators to signal a website address to complete their resume. Validators will need to build reputation one way or another to attract delegators. For example, it would be a good practice for validators to have their setup audited by third parties. Note though, that the realio team will not approve or conduct any audit themselves. For more on due diligence, see this blog post.

### Where can I see all active validators?
All active validators can be found on [The Realio Network Explorer](https://explorer.realio.network/validators) or on the [Realio Platform](https://app.realio.fund/network/portal)

### Can a validator run away with their delegators' tokens?
By delegating to a validator, a user delegates voting power. The more voting power a validator have, the more weight they have in the consensus and governance processes. This does not mean that the validator has custody of their delegators' tokens. By no means can a validator run away with its delegator's funds.
Even though delegated funds cannot be stolen by their validators, delegators are still liable if their validators misbehave.

### How long will my funds be locked up (bonded) if I delegate?
Delegating your tokens will lock your funds up until you undelegate them. You must undelegate your funds and wait 7 days for your delegated assets to be liquid again.

### Do I have to wait 7 days to switch validators?
Delegators have the flexibility to choose which validator node they want to delegate their assets to. You can easily switch validators 1 time without having to wait the 7-day lockup period. After the first redelegation, you will need to wait the 7-day lockup period to redelegate.

### Can I add Realio Network to any Web3 wallets?
Yes, you can connect Realio Network to both MetaMask and Keplr wallets. See the full [directions here.](https://www.realio.fund/blog/how-to-add-realio-network-to-keplr-metamask)
