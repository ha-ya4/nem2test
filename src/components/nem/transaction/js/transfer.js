import {
  Account,
  TransactionHttp,
  NetworkType,
} from 'nem2-sdk';
import Transaction from './base-transaction';
import ResultState from '../../../../js/resultstate';
import { createTransfer } from '../../../../js/nemhelper';

export default class TransferTransaction extends Transaction {
  send(params, privateKey) {
    try {
      const tx = createTransfer(params);
      const sender = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
      const signedTx = sender.sign(tx, process.env.REACT_APP_GENERATION_HASH);
      const transHttp = new TransactionHttp(this.node);
      const res = transHttp.announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(sender.address, signedTx);

    } catch (err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }
}