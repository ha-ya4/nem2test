import {
  Address,
  UInt64,
  EmptyMessage,
  PlainMessage,
  Listener,
  MosaicId,
  Mosaic,
} from 'nem2-sdk';
import { mosaicInfo } from './mosaic';

export const NetworkCurrencyMosaicDivisibility = 6;

export function divisibility(n) {
  return Math.pow(10, n)
}

export function networkCurrencyMosaic(amount) {
  return new Mosaic(
    new MosaicId('75AF035421401EF0'),
    UInt64.fromUint(parseFloat(amount) * divisibility(NetworkCurrencyMosaicDivisibility))
  );
}

export function createMessage(message) {
  return message === '' ? EmptyMessage : PlainMessage.create(message);
}

export function monitoring(senderAddress, signedTx, endpoint) {
  const wsEndpoint = endpoint.replace('http', 'ws');
  const address = Address.createFromRawAddress(senderAddress);
  const listener = new Listener(wsEndpoint, WebSocket);

  return (status, confirmed, error) => {
    listener.open().then(() => {
      listener.status(address).subscribe(res => {
        status(res);
      });
      listener.confirmed(address, signedTx.hash).subscribe(res => {
        confirmed(res);
        listener.close();
      });
    }, err => {
      error(err);
      listener.close();
    });
  }
}

export async function addDivisibilityTransResponse(obj, node) {
  if (obj.innerTransactions) {
    for (const t of obj.innerTransactions) {
      for (const m of t.mosaics) {
        const res = await mosaicInfo(m.id, node).toPromise(Promise);
        m.id = m.id.toHex()
        m.amount = m.amount.compact() / divisibility(res.divisibility);
      }
    }
    return;
  }

  for (const m of obj.mosaics) {
    const res = await mosaicInfo(m.id, node).toPromise(Promise);
    m.id = m.id.toHex()
    m.amount = m.amount.compact() / divisibility(res.divisibility);
  }
}