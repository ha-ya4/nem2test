import {
  PublicAccount,
  TransactionHttp,
  NetworkType,
} from 'nem2-sdk';
import Transaction from './base-transaction';
import ResultState from '../../../../js/resultstate';
import { createTransfer, createAggregeteComplete } from '../../../../js/nemhelper';

export default class MultisigTransaction extends Transaction {
  send(params) {
    if (this.isOneOfMultisig(params.cosignatoryPrivateKeys)) {
      this.sendComplete(params);
    } else {
      this.sendBonded(params);
    }
  }

  sendComplete(params) {
    try {
      const cosignatoryAccount = params.getCosignatoryAccount()[0];
      const multisigAccount = PublicAccount.createFromPublicKey(params.multisigPubKey, NetworkType.TEST_NET);
      const transferTransaction = createTransfer(params.params);
      const aggregateTransaction = createAggregeteComplete([transferTransaction.toAggregate(multisigAccount)], []);
      const signedTx = cosignatoryAccount.sign(aggregateTransaction, process.env.REACT_APP_GENERATION_HASH);
      const res = new TransactionHttp(this.node).announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(multisigAccount.address, signedTx);

    }
    catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }

  sendBonded(params) {
  }

  isOneOfMultisig(privateKeys) {
    return privateKeys.length === 1
  }
}