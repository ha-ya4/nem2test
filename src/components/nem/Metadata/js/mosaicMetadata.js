import {
  MetadataHttp,
  MosaicId,
} from 'nem2-sdk';
import { Transaction } from '../../../../js/nemhelper';
import ResultState from '../../../../js/resultstate';

export default class MosaicMetadata extends Transaction {
  getMetadataInfo(id) {
    try {
      const mosaicId = new MosaicId(id);
      new MetadataHttp(this.node).getMosaicMetadata(mosaicId).subscribe(info => {
        this.setResult(ResultState.success(info, 'モザイクメタデータ情報'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      });

    }  catch(err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
  }
}