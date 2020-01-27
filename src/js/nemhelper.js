import {
  UInt64,
  EmptyMessage,
  PlainMessage,
  MosaicId,
  Mosaic,
} from 'nem2-sdk';

export const NetworkCurrencyMosaicId = new MosaicId('75AF035421401EF0');
export const NetworkCurrencyMosaicDivisibility = 6;

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
