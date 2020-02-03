import {
  Address,
  AggregateTransaction,
  CosignatureTransaction,
  UInt64,
  Deadline,
  EmptyMessage,
  HashLockTransaction,
  PlainMessage,
   
  NamespaceId,
  MosaicId,
  Mosaic,
  MosaicHttp,
  MosaicSupplyChangeTransaction,
  TransferTransaction,
  ReceiptHttp,
  TransactionHttp,
  TransactionService,
  Listener,
} from 'nem2-sdk';
import { merge } from "rxjs/operators";
import ResultState from './resultstate';

export const NetworkCurrencyMosaicId = new MosaicId('75AF035421401EF0');
export const NetworkCurrencyMosaicDivisibility = 6;
export const HashLockAmount = 10;

export function divisibility(n) {
  return Math.pow(10, n)
}

export function networkCurrencyMosaic(amount) {
  return new Mosaic(
    NetworkCurrencyMosaicId ,
    UInt64.fromUint(parseFloat(amount) * divisibility(NetworkCurrencyMosaicDivisibility))
  );
}

export function createMessage(message) {
  return message === '' ? EmptyMessage : PlainMessage.create(message);
}

export function createAggregeteBonded(innerTrans, cosignatures) {
  return AggregateTransaction.createBonded(
    Deadline.create(),
    innerTrans,
    process.env.REACT_APP_NETWORK_TYPE,
    cosignatures,
    UInt64.fromUint(2000000)
  );
}

export function createAggregeteComplete(innerTrans, cosignatures) {
  return AggregateTransaction.createComplete(
    Deadline.create(),
    innerTrans,
    process.env.REACT_APP_NETWORK_TYPE,
    cosignatures,
    UInt64.fromUint(2000000)
  );
}

export function createTransfer(params) {
  let recipient;
  try {
    recipient = Address.createFromRawAddress(params.recipientAddress);
  } catch(err) {
    recipient = new NamespaceId(params.recipientAddress);
  }
  return TransferTransaction.create(
    Deadline.create(),
    recipient,
    [networkCurrencyMosaic(params.amount)],
    createMessage(params.message),
    process.env.REACT_APP_NETWORK_TYPE,
    UInt64.fromUint(200000)
  );
}

export function createHashLock(sinedTx) {
  return HashLockTransaction.create(
    Deadline.create(),
    networkCurrencyMosaic(HashLockAmount),
    UInt64.fromUint(480),
    sinedTx,
    process.env.REACT_APP_NETWORK_TYPE,
    UInt64.fromUint(2000000)
  )
}

export function createMosaicSupplyChangeTransaction(action, mosaicId, supply) {
  return MosaicSupplyChangeTransaction.create(
    Deadline.create(),
    mosaicId,
    action,
    UInt64.fromUint(supply),
    process.env.REACT_APP_NETWORK_TYPE,
    UInt64.fromUint(2000000)
  );
}

export class Transaction {
  constructor(setResult, node) {
    this.setResult = setResult;
    this.node = node;
    this.wsEndpoint = this.node.replace('http', 'ws');
  }

  handleAnnounceResponse(response, signedTx) {
    response.subscribe(res => {
      res['hash'] = signedTx.hash;
      this.setResult(ResultState.none(res, 'announce response'));
    },
    err => {
      this.setResult(ResultState.danger(err.message, 'エラー'))
    });
  }

  transferMonitoring(address, signedTx) {
    const listener = new Listener(this.wsEndpoint, WebSocket);
    listener.open().then(
      () => {

        listener.status(address).subscribe(err => {
          this.setResult(ResultState.danger(err.code, 'tansaction status error'));
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

  monitoring(address, signedTx) {
    const listener = new Listener(this.wsEndpoint, WebSocket);
    listener.open().then(
      () => {

        listener.status(address).subscribe(err => {
          this.setResult(ResultState.danger(err.code, 'tansaction status error'));
          listener.close();
        });

        listener.confirmed(address, signedTx.hash).subscribe(res => {
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
    const mosaicHttp = new MosaicHttp(this.node, process.env.REACT_APP_NETWORK_TYPE);
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
}

export class AggregeteBondedHelper {
  constructor(setResult, node, signedTx, signedHashLock) {
    this.setResult = setResult;
    this.node = node;
    this.signedTx = signedTx;
    this.signedHashLock = signedHashLock;
    this.wsEndpoint = this.node.replace('http', 'ws');
  }

  announceBonded(signer, cosignatory, complete) {
    const receiptHttp = new ReceiptHttp(this.node, process.env.REACT_APP_NETWORK_TYPE);
    const transHttp = new TransactionHttp(this.node, process.env.REACT_APP_NETWORK_TYPE);
    const transactionService = new TransactionService(transHttp, receiptHttp);
    const listener = new Listener(this.wsEndpoint, WebSocket);

    listener.open().then(() => {
      listener.status(signer.address).subscribe(err => {
        this.setResult(ResultState.danger(err.code, 'tansaction status error'));
        listener.close();
      });

      transactionService.announceHashLockAggregateBonded(this.signedHashLock, this.signedTx, listener).subscribe(
        tx => {
          this.setResult(ResultState.none(tx, 'aggregate bonded response'));
          this.announceBondedCosignature(transHttp, cosignatory, tx, complete)
          listener.close();
        },
        err => {
          this.setResult(ResultState.danger(err.message, 'エラー'));
          listener.close();
        }
      )
    });
  }

  announceBondedCosignature(transHttp, cosignatory, agrregateTx, complete) {
    const announce = cosignatory.map(account => {
      const cosignatureTransaction = CosignatureTransaction.create(agrregateTx);
      const signedCosignature = account.signCosignatureTransaction(cosignatureTransaction);
      return transHttp.announceAggregateBondedCosignature(signedCosignature);
    });

    announce[0].pipe(merge(...announce.slice(1))).subscribe(
      res => {
        this.setResult(ResultState.none(res, 'cosignature response'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      },
      () => {
        setTimeout(() => {
          complete()
        }, 30000);
      }
    );
  }
}