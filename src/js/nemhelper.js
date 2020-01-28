import {
  Address,
  AggregateTransaction,
  UInt64,
  Deadline,
  EmptyMessage,
  HashLockTransaction,
  PlainMessage,
  NetworkType,
  MosaicId,
  Mosaic,
  TransferTransaction,
} from 'nem2-sdk';

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
    NetworkType.TEST_NET,
    cosignatures,
    UInt64.fromUint(2000000)
  );
}

export function createTransfer(params) {
  return TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(params.recipientAddress),
    [networkCurrencyMosaic(params.amount)],
    createMessage(params.message),
    NetworkType.TEST_NET,
    UInt64.fromUint(200000)
  );
}

export function createHashLock(sinedTx) {
  return HashLockTransaction.create(
    Deadline.create(),
    networkCurrencyMosaic(HashLockAmount),
    UInt64.fromUint(480),
    sinedTx,
    NetworkType.TEST_NET,
    UInt64.fromUint(2000000)
  )
}