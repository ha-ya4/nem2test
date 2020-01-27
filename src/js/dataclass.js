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

export class FormState {
  constructor(recipient, amount, message) {
    this.recipient = recipient;
    this.amount = amount;
    this.message = message;
  }

  static init() {
    return new FormState('', 0, '');
  }
}