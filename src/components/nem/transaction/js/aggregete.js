import {
  Account,
  AggregateTransaction as AggregateTX,
  Deadline,
  TransactionHttp,
  NetworkType,
  UInt64,
  Listener,
} from 'nem2-sdk';
import Transaction from './base-transaction';
import ResultState from '../../../../js/resultstate';

export default class AggregateTransaction extends Transaction {
  sendComplete(params, privateKey) {
    try{
      const txs = params.map(p => this.createTransfer(p));
      const sender = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
      const aggregateTx = AggregateTX.createComplete(
        Deadline.create(),
        txs.map(tx => tx.toAggregate(sender.publicAccount)),
        NetworkType.TEST_NET,
        [],
        UInt64.fromUint(200000)
      );
      const signedTx = sender.sign(aggregateTx, process.env.REACT_APP_GENERATION_HASH);
      const transHttp = new TransactionHttp(this.node);
      const res = transHttp.announce(signedTx);

      this.handleAnnounceResponse(res);
      this.monitoring(sender.address, signedTx);

    } catch (err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }
}