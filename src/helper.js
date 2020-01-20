import { toaster } from 'evergreen-ui';

export class AppAccount {
  constructor(account) {
    this.address = account.address.address;
    this.publicKey = account.publicKey;
    this.privateKey = account.privateKey;
  }
}

export class MultisigAccountConf {
  constructor(privateKey, publicKeys, minApprovalDelta, minRemovalDelta) {
    this.privateKey = privateKey;
    this.publicKeys = publicKeys;
    this.minApprovalDelta = minApprovalDelta;
    this.minRemovalDelta = minRemovalDelta;
  }
}

export class SendParams {
  constructor(recipientAddress, amount, message) {
    this.recipientAddress = recipientAddress;
    this.amount = amount;
    this.message = message;
  }
}

export class ResultState {
  constructor(isSpinnerShown, isResultShown, result, intent, ReultTitle) {
    this.isSpinnerShown = isSpinnerShown;
    this.isResultShown = isResultShown;
    this.result = result;
    this.intent = intent
    this.title = ReultTitle;
  }

  static init() {
    return new ResultState(false, false, {}, 'success', '')
  }
}

class FormState {
  constructor(recipient, amount, message) {
    this.recipient = recipient;
    this.amount = amount;
    this.message = message;
  }

  static init() {
    return new FormState('', 0, '');
  }
}

export class FormStateManager {
  constructor(quantity) {
    this.quantity = quantity;
    this.forms = {};
    for (let i = 1; i <= quantity; i++) {
      this.forms[i] = FormState.init();
    }
  }

  set(num, name, value) {
    this.forms[num][name] = value;
    return this;
  }

  add() {
    return new FormStateManager(this.quantity + 1);
  }
}

export function getPrivateKey() {
  const key = localStorage.getItem('privateKey');
  if (key) {
    return key;
  } else {
    toaster.warning('ローカルストレージに秘密鍵が保存されていません');
    return '';
  }
}
