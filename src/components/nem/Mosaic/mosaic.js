import {
  Account,
  Deadline,
  TransactionHttp,
  MosaicId,
  MosaicHttp,
  MosaicNonce,
  MosaicFlags,
  UInt64,
  MosaicDefinitionTransaction,
  MosaicSupplyChangeAction,
} from 'nem2-sdk';
import { Transaction, createAggregeteComplete, createMosaicSupplyChangeTransaction } from '../../../js/nemhelper';
import ResultState from '../../../js/resultstate';

export default class Namespace extends Transaction {
  newMosaic(privateKey, conf) {
    try {
      const account = Account.createFromPrivateKey(privateKey, process.env.REACT_APP_NETWORK_TYPE);
      const nonce = MosaicNonce.createRandom();
      conf.duration = UInt64.fromUint(conf.duration);

      const definition = MosaicDefinitionTransaction.create(
        Deadline.create(),
        nonce,
        MosaicId.createFromNonce(nonce, account.publicAccount),
        MosaicFlags.create(conf.supplyMutable, conf.transferable, conf.restrictable),
        conf.divisibility,
        conf.duration,
        process.env.REACT_APP_NETWORK_TYPE,
        UInt64.fromUint(2000000)
      );
      const supplyChange = createMosaicSupplyChangeTransaction(MosaicSupplyChangeAction.Increase, definition.mosaicId, conf.initialSupply);

      const mdt = definition.toAggregate(account.publicAccount);
      const msct = supplyChange.toAggregate(account.publicAccount);
      const aggregeteComplete = createAggregeteComplete([mdt, msct], []);
      const signedTx = account.sign(aggregeteComplete, process.env.REACT_APP_GENERATION_HASH);
      const res = new TransactionHttp(this.node).announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(account.address, signedTx);

    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }

  supplyChange(privateKey, conf, action) {
    try {
      const account = Account.createFromPrivateKey(privateKey, process.env.REACT_APP_NETWORK_TYPE);
      const mosaicId = new MosaicId(conf.mosaicId);
      const supplyChange = createMosaicSupplyChangeTransaction(action, mosaicId, conf.supply);
      const signedTx = account.sign(supplyChange, process.env.REACT_APP_GENERATION_HASH);
      const res = new TransactionHttp(this.node).announce(signedTx);

      this.handleAnnounceResponse(res, signedTx);
      this.monitoring(account.address, signedTx);
    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }

  getMosaicInfo(mosaicId) {
    try {
      const id = new MosaicId(mosaicId);
      new MosaicHttp(this.node).getMosaic(id).subscribe(
        info => {
          this.setResult(ResultState.success(info, 'mosaic info'));
        },
        err => {
          this.setResult(ResultState.danger(err.message, 'エラー'));
        }
      )

    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }
}