import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {
  NodeIcon,
  ShieldCheckIcon,
  ShieldQuestionIcon,
  GlobeIcon,
  BookIcon,
  ChatQuestionIcon,
  CodeBracketsIcon,
} from './icons';

const CardList = [
  {
    title: 'EVM Compatibility',
    description: 'Deploy Solidity contracts and connect wallets via the built-in EVM',
    to: '/evm-compatibility/evm-overview',
    Icon: CodeBracketsIcon,
  },
  {
    title: 'Realio Network Full Node',
    description: 'How to setup and manage a Full Node',
    to: '/fullnode/overview',
    Icon: NodeIcon,
  },
  {
    title: 'Become a Realio Validator',
    description: 'Validator Setup, Halting, Migrating',
    to: '/validators/overview',
    Icon: ShieldCheckIcon,
  },
  {
    title: 'Delegators Overview',
    description: 'Delegate RIO or RST to a validator and earn staking rewards',
    to: '/delegators/overview',
    Icon: ChatQuestionIcon,
  },
  {
    title: 'Public Testnet',
    description: 'Participate in the Realio public test network',
    to: '/testnet/overview',
    Icon: GlobeIcon,
  },
  {
    title: 'Public Mainnet',
    description: 'Connect to and interact with the Realio public mainnet',
    to: '/mainnet/overview',
    Icon: ShieldQuestionIcon,
  },
  {
    title: 'Developer Resources',
    description: 'Tools and documentation for Realio developers',
    to: '/developers/overview',
    Icon: BookIcon,
  },
];

function Card({title, description, to, Icon}) {
  return (
    <Link to={to} className={styles.card}>
      <span className={styles.iconBadge}>
        <Icon className={styles.icon} />
      </span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function HomepageCards() {
  return (
    <div className={styles.grid}>
      {CardList.map((props) => (
        <Card key={props.title} {...props} />
      ))}
    </div>
  );
}
