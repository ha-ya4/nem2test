import {
  Account,
  TransactionHttp,
  NetworkType,
} from 'nem2-sdk';
import Transaction from './base-transaction';
import ResultState from '../../../../js/resultstate';
import { createTransfer, createAggregeteComplete } from '../../../../js/nemhelper';

export default class AggregateTransaction extends Transaction {
  sendComplete(params, privateKey) {
    try{
      const txs = params.map(p => createTransfer(p));
      const sender = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
      const aggregateTx = createAggregeteComplete(txs.map(tx => tx.toAggregate(sender.publicAccount)), []);
      const signedTx = sender.sign(aggregateTx, process.env.REACT_APP_GENERATION_HASH);
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