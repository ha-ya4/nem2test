import {
  Address,
  Deadline,
  NetworkType,
  TransferTransaction,
  HashLockTransaction,
  UInt64,
  MosaicHttp,
  Listener,
} from 'nem2-sdk';

import {
  createMessage,
  divisibility,
  networkCurrencyMosaic,
  HashLockAmount,
} from '../../../../js/nemhelper';

import ResultState from '../../../../js/resultstate';

export default class Transaction {
  constructor(setResult, node) {
    this.setResult = setResult;
    this.node = node;
    this.wsEndpoint = this.node.replace('http', 'ws');
  }

  handleAnnounceResponse(response) {
    response.subscribe(res => {
      this.setResult(ResultState.none(res, 'announce response'));
    },
    err => {
      this.setResult(ResultState.danger(err.message, 'エラー'))
    });
  }

  monitoring(address, signedTx) {
    const listener = new Listener(this.wsEndpoint, WebSocket);
    listener.open().then(
      () => {

        listener.status(address).subscribe(err => {
          this.setResult(ResultState.danger(err.message, 'tansaction status error'));
          listener.close();
        });

        listener.confirmed(address, signedTx.hash).subscribe(async res => {
          await this.addDivisibilityTransResponse(res);
          res.transactionInfo.heightCompact = res.transactionInfo.height.compact()
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

  async addDivisibilityTransResponse(obj) {
    const mosaicHttp = new MosaicHttp(this.node, NetworkType.TEST_NET);
    if (obj.innerTransactions) {
      for (const t of obj.innerTransactions) {
        for (const m of t.mosaics) {
          const res = await mosaicHttp.getMosaic(m.id).toPromise(Promise);
          m.id = m.id.toHex()
          m.amount = m.amount.compact() / divisibility(res.divisibility);
        }
      }
      return;
    }

    for (const m of obj.mosaics) {
      const res = await mosaicHttp.getMosaic(m.id).toPromise(Promise);
      m.id = m.id.toHex()
      m.amount = m.amount.compact() / divisibility(res.divisibility);
    }
  }

  createTransfer(params) {
    return TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(params.recipientAddress),
      [networkCurrencyMosaic(params.amount)],
      createMessage(params.message),
      NetworkType.TEST_NET,
      UInt64.fromUint(200000)
    );
  }

  hashLock(sinedTx) {
    return HashLockTransaction.create(
      Deadline.create(),
      networkCurrencyMosaic(HashLockAmount),
      UInt64.fromUint(480),
      sinedTx,
      NetworkType.TEST_NET,
      UInt64.fromUint(2000000)
    )
  }
}