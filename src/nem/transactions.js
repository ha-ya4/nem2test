import {
  Account,
  Address,
  Deadline,
  NetworkType,
  AggregateTransaction,
  TransferTransaction,
  TransactionHttp,
  TransactionService,
  UInt64,
  HashLockTransaction,
  ReceiptHttp,
  Listener,
} from 'nem2-sdk';

import {
  networkCurrencyMosaic,
  createMessage,
  monitoring,
} from './func';

function signAndAnnounce(sender, tx, endpoint) {
  const signedTx = sender.sign(tx, process.env.REACT_APP_GENERATION_HASH);
  const transHttp = new TransactionHttp(endpoint);
  const res = transHttp.announce(signedTx);
  const listener = monitoring(sender.address.address, signedTx, endpoint);

  return {
    res: res,
    listener: listener
  };
}

export function transfer(params, privateKey, node) {
  try {
    const transferTx = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(params.recipientAddress),
      [networkCurrencyMosaic(params.amount)],
      createMessage(params.message),
      NetworkType.TEST_NET,
      UInt64.fromUint(200000)
    );

    const sender = Account.createFromPrivateKey(
      privateKey,
      NetworkType.TEST_NET
    );

    return signAndAnnounce(sender, transferTx, node);

  } catch (err) {
    return {
      error: err
    }
  }
}

export function aggregateComplete(params, privateKey, node) {
  try{
    const txs = params.map(p => {
      return TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress(p.recipientAddress),
        [networkCurrencyMosaic(p.amount)],
        createMessage(p.message),
        NetworkType.TEST_NET,
        UInt64.fromUint(200000)
      );
    })

    const sender = Account.createFromPrivateKey(
      privateKey,
      NetworkType.TEST_NET
    );

    const aggregateTx = AggregateTransaction.createComplete(
      Deadline.create(),
      txs.map(tx => tx.toAggregate(sender.publicAccount)),
      NetworkType.TEST_NET,
      [],
      UInt64.fromUint(200000)
    )

    return signAndAnnounce(sender, aggregateTx, node);
  } catch (err) {
    return {
      error: err
    }
  }
}

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