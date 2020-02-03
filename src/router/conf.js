import {
  AccountInfo,
  NewAccount,
  NewMultisigAccount,
  MultisigAccountInfo,
  NewMosaic,
  SupplyChange,
  MosaicInfo,
  NewNamespace,
  NamespaceAlias,
  NamespaceInfo,
  BlockInfo,
  MosaicMetadataInfo,
  TransferTransaction,
  MultisigTransaction,
  AggregateTransaction,
} from '../components';

export const routes = [
  {
    path: '/account/new',
    component: NewAccount
  },
  {
    path: '/account/info',
    component:AccountInfo
  },
  {
    path: '/account/new/multisig',
    component: NewMultisigAccount
  },
  {
    path: '/account/info/multisig',
    component: MultisigAccountInfo
  },
  {
    path: '/namespace/new',
    component: NewNamespace
  },
  {
    path: '/namespace/alias',
    component: NamespaceAlias
  },
  {
    path: '/namespace/info',
    component: NamespaceInfo
  },
  {
    path: '/mosaic/new',
    component: NewMosaic
  },
  {
    path: '/mosaic/supplychange',
    component: SupplyChange
  },
  {
    path: '/mosaic/info',
    component: MosaicInfo
  },
  {
    path: '/block/info',
    component: BlockInfo
  },
  {
    path: '/metadata/mosaic/info',
    component: MosaicMetadataInfo
  },
  {
    path: '/transfer_transaction',
    component: TransferTransaction
  },
  {
    path: '/multisig_transaction',
    component: MultisigTransaction
  },
  {
    path: '/aggregate_transaction',
    component: AggregateTransaction
  },
]

export const link = [
  {
    to: '/account/new',
    text: 'アカウント作成'
  },
  {
    to: '/account/info',
    text: 'アカウント情報'
  },
  {
    to: '/account/new/multisig',
    text: 'マルチシグアカウント作成'
  },
  {
    to: '/account/info/multisig',
    text: 'マルチシグアカウント情報'
  },
  {
    to: '/namespace/new',
    text: 'ネームスペース作成'
  },
  {
    to: '/namespace/alias',
    text: 'ネームスペースエイリアス'
  },
  {
    to: '/namespace/info',
    text: 'ネームスペース情報'
  },
  {
    to: '/mosaic/new',
    text: 'モザイク作成'
  },
  {
    to: '/mosaic/supplychange',
    text: 'モザイク供給変更'
  },
  {
    to: '/mosaic/info',
    text: 'モザイク情報'
  },
  {
    to: '/block/info',
    text: 'ブロック情報'
  },
  {
    to: '/metadata/mosaic/info',
    text: 'モザイクメタデータ情報'
  },
  {
    to: '/transfer_transaction',
    text: 'TransferTransaction'
  },
  {
    to: '/multisig_transaction',
    text: 'MultisigTransaction'
  },
  {
    to: '/aggregate_transaction',
    text: 'AggregateTransaction'
  },
]