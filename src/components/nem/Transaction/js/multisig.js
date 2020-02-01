import {
  PublicAccount,
  TransactionHttp,
  NetworkType,
} from 'nem2-sdk';
import { Transaction } from '../../../../js/nemhelper';
import ResultState from '../../../../js/resultstate';
import {
  createHashLock,
  createTransfer,
  createAggregeteComplete,
  createAggregeteBonded,
  AggregeteBondedHelper,
} from '../../../../js/nemhelper';

export default class MultisigTransaction extends Transaction {
  send(params) {
    try {
      const cosignatory = params.getCosignatoryAccount();
      const multisigAccount = PublicAccount.createFromPublicKey(params.multisigPubKey, NetworkType.TEST_NET);
      const transferTransaction = createTransfer(params.params);

      if (this.isOneOfMultisig(params.cosignatoryPrivateKeys)) {
        this.sendComplete(cosignatory, multisigAccount, transferTransaction);
      } else {
        this.sendBonded(cosignatory, multisigAccount, transferTransaction);
      }
    } catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }

  sendComplete(cosignatory, multisigAccount, transferTransaction) {
    const cosignatoryAccount = cosignatory[0];
    const aggregateTransaction = createAggregeteComplete([transferTransaction.toAggregate(multisigAccount)], []);
    const signedTx = cosignatoryAccount.sign(aggregateTransaction, process.env.REACT_APP_GENERATION_HASH);
    const res = new TransactionHttp(this.node).announce(signedTx);

    this.handleAnnounceResponse(res, signedTx);
    this.monitoring(multisigAccount.address, signedTx);
  }

  sendBonded(cosignatory, multisigAccount, transferTransaction) {
    const cosignatoryAccount = cosignatory[0];
    const aggregateTransaction = createAggregeteBonded([transferTransaction.toAggregate(multisigAccount)], []);
    const signedTx = cosignatoryAccount.sign(aggregateTransaction, process.env.REACT_APP_GENERATION_HASH);
    const signedHashLock = cosignatoryAccount.sign(createHashLock(signedTx), process.env.REACT_APP_GENERATION_HASH);

    const bondedHelper = new AggregeteBondedHelper(this.setResult, this.node, signedTx, signedHashLock);
    bondedHelper.announceBonded(cosignatoryAccount, cosignatory.slice(1), () => {
      new TransactionHttp(this.node).getTransaction(signedTx.hash).subscribe(async res => {
        await this.addDivisibilityTransResponse(res);
        res.transactionInfo.heightCompact = res.transactionInfo.height.compact()
        this.setResult(ResultState.success(res, 'confirmed'));
      })
    })
  }

  isOneOfMultisig(privateKeys) {
    return privateKeys.length === 1
  }
}