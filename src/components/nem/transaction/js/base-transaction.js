import {
  NetworkType,
  MosaicHttp,
  Listener,
} from 'nem2-sdk';

import { divisibility } from '../../../../js/nemhelper';

import ResultState from '../../../../js/resultstate';

export default class Transaction {
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

  monitoring(address, signedTx) {
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
}