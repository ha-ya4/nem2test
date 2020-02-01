export class AccountConf {
  constructor(account) {
    this.address = account.address.address;
    this.publicKey = account.publicKey;
    this.privateKey = account.privateKey;
  }
}

export class SendParams {
  constructor(recipientAddress, amount, message) {
    this.recipientAddress = recipientAddress;
    this.amount = amount;
    this.message = message;
  }
}

export class TransactionParamsState {
  constructor(recipient, amount, message) {
    this.recipient = recipient;
    this.amount = amount;
    this.message = message;
  }

  static init() {
    return new TransactionParamsState('', 0, '');
  }
}

export class MosaicConf {
  constructor(duration, supplyMutable, transferable, restrictable, initialSupply, divisibility) {
    this.duration = duration;
    this.supplyMutable = supplyMutable;
    this.transferable = transferable;
    this.restrictable = restrictable;
    this.initialSupply = initialSupply;
    this.divisibility = divisibility;
  }

  static init() {
    return new MosaicConf(0, true, true, true, 0, 0);
  }
}