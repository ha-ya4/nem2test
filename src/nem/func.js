import {
  UInt64,
  MosaicId,
  Mosaic,
} from 'nem2-sdk';

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