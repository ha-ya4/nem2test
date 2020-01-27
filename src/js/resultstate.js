export default class ResultState {
  constructor(isSpinnerShown, isResultShown, result, intent, reultTitle) {
    this.isSpinnerShown = isSpinnerShown;
    this.isResultShown = isResultShown;
    this.result = result;
    this.intent = intent
    this.title = reultTitle;
  }

  static init() {
    return new ResultState(false, false, {}, '', '')
  }

  static loading() {
    return new ResultState(true, false, {}, '', '')
  }

  static none(contents, resultTitle) {
    return new ResultState(false, true, contents, 'none', resultTitle)
  }

  static success(contents, resultTitle) {
    return new ResultState(false, true, contents, 'success', resultTitle)
  }

  static danger(contents, resultTitle) {
    return new ResultState(false, true, contents, 'danger', resultTitle)
  }
}