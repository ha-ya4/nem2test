import {
  Deadline,
  NetworkType,
  AggregateTransaction,
  TransactionHttp,
  TransactionService,
  UInt64,
  HashLockTransaction,
  ReceiptHttp,
  Listener,
} from 'nem2-sdk';

import {
  networkCurrencyMosaic,
} from './func';

export function aggregeteBonded(node, innerTrans, account) {
  const bonded = AggregateTransaction.createBonded(
    Deadline.create(),
    innerTrans,
    NetworkType.TEST_NET,
    [],
    UInt64.fromUint(2000000)
  );

  const signedTx = account.sign(bonded, process.env.REACT_APP_GENERATION_HASH);
  const signedHashLock = hashLock(account, signedTx);
  const receiptHttp = new ReceiptHttp(node, NetworkType.TEST_NET);
  const transHttp = new TransactionHttp(node, NetworkType.TEST_NET);
  const transactionService = new TransactionService(transHttp, receiptHttp);
  const listener = new Listener(node.replace('http', 'ws'), WebSocket);

  return (status, confirmed) => {
    listener.open().then(() => {
      listener.status(account.address).subscribe(e => {
        status(e);
      })
      transactionService.announceHashLockAggregateBonded(signedHashLock, signedTx, listener).subscribe(tx => {
        confirmed(tx)
        listener.close();
      })
    });
  }
}

export function hashLock(account, sinedTx) {
  const hashLock = HashLockTransaction.create(
    Deadline.create(),
    networkCurrencyMosaic(10),
    UInt64.fromUint(480),
    sinedTx,
    NetworkType.TEST_NET,
    UInt64.fromUint(2000000)
  )
  return account.sign(hashLock, process.env.REACT_APP_GENERATION_HASH);
}