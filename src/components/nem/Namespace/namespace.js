import {
  Account,
  Deadline,
  TransactionHttp,
  NetworkType,
  UInt64,
  NamespaceRegistrationTransaction,
  NamespaceId,
  NamespaceHttp,
  Listener,
} from 'nem2-sdk';
import { Transaction } from '../../../js/nemhelper';
import ResultState from '../../../js/resultstate';

export default class Namespace extends Transaction {
  newNamespace(conf, privateKey) {
    try {
      const account = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
      const namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createRootNamespace(
        Deadline.create(),
        conf.name,
        UInt64.fromUint(conf.duration),
        NetworkType.TEST_NET,
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
    //try {
      const account = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
      const namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createSubNamespace(
        Deadline.create(),
        conf.subNamespace,
        conf.rootNamespace,
        NetworkType.TEST_NET,
        UInt64.fromUint(2000000)
      );
      const signedTx = account.sign(namespaceRegistrationTransaction, process.env.REACT_APP_GENERATION_HASH)
      const res = new TransactionHttp(this.node).announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(account.address, signedTx);
/*
    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }*/
  }

  getNamespaceInfo(name) {
    const namespace = new NamespaceId(name);
    new NamespaceHttp(this.node).getNamespace(namespace).subscribe(info => {
      this.setResult(ResultState.success(info, 'Namespace情報'));
    },
    err => {
      this.setResult(ResultState.danger(err.message, 'エラー'));
    });
  }

  monitoring(address, signedTx) {
    const listener = new Listener(this.wsEndpoint, WebSocket);
    listener.open().then(
      () => {

        listener.status(address).subscribe(err => {
          this.setResult(ResultState.danger(err.code, 'tansaction status error'));
          listener.close();
        });

        listener.confirmed(address, signedTx.hash).subscribe(async res => {
          this.setResult(ResultState.success(res, 'confirmed'));
          listener.close();
        });

      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
        listener.close();
      },
    );
  }
}