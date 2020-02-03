import {
  Account,
  Address,
  AliasTransaction,
  Deadline,
  TransactionHttp,
  UInt64,
  NamespaceRegistrationTransaction,
  NamespaceId,
  NamespaceHttp,
  MosaicId,
} from 'nem2-sdk';
import { Transaction } from '../../../js/nemhelper';
import ResultState from '../../../js/resultstate';

export default class Namespace extends Transaction {
  newNamespace(conf, privateKey) {
    try {
      const account = Account.createFromPrivateKey(privateKey, process.env.REACT_APP_NETWORK_TYPE);
      const namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createRootNamespace(
        Deadline.create(),
        conf.name,
        UInt64.fromUint(conf.duration),
        process.env.REACT_APP_NETWORK_TYPE,
        UInt64.fromUint(2000000)
      );
      const signedTx = account.sign(namespaceRegistrationTransaction, process.env.REACT_APP_GENERATION_HASH)
      const res = new TransactionHttp(this.node).announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(account.address, signedTx);

    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }

  newSubNamespace(conf, privateKey) {
    try {
      const account = Account.createFromPrivateKey(privateKey, process.env.REACT_APP_NETWORK_TYPE);
      const namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createSubNamespace(
        Deadline.create(),
        conf.subNamespace,
        conf.rootNamespace,
        process.env.REACT_APP_NETWORK_TYPE,
        UInt64.fromUint(2000000)
      );
      const signedTx = account.sign(namespaceRegistrationTransaction, process.env.REACT_APP_GENERATION_HASH);
      const res = new TransactionHttp(this.node).announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(account.address, signedTx);

    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }

  alias(privateKey, namespace, value, type, action) {
    try {
      const account = Account.createFromPrivateKey(privateKey, process.env.REACT_APP_NETWORK_TYPE);
      const namespaceId = new NamespaceId(namespace);
      let aliasTransaction;
      type.address
        ? aliasTransaction = this.createAddressAlias(action, namespaceId, value)
        : aliasTransaction = this.createMosaicAlias(action, namespaceId, value);

      const signedTx = account.sign(aliasTransaction, process.env.REACT_APP_GENERATION_HASH);
      const res = new TransactionHttp(this.node).announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(account.address, signedTx);

    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }

  createAddressAlias(action, namespace, value) {
    const address = Address.createFromRawAddress(value);
    return AliasTransaction.createForAddress(
      Deadline.create(),
      action,
      namespace,
      address,
      process.env.REACT_APP_NETWORK_TYPE,
      UInt64.fromUint(2000000)
    );
  }

  createMosaicAlias(action, namespace, value) {
    const mosaicId = new MosaicId(value);
    return AliasTransaction.createForMosaic(
      Deadline.create(),
      action,
      namespace,
      mosaicId,
      process.env.REACT_APP_NETWORK_TYPE,
      UInt64.fromUint(2000000)
    );
  }

  getNamespaceInfo(name) {
    try {
      const namespace = new NamespaceId(name);
      new NamespaceHttp(this.node).getNamespace(namespace).subscribe(info => {
        this.setResult(ResultState.success(info, 'Namespace情報'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      });
    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }
}