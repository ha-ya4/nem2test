import {
  MosaicHttp,
  NetworkType,
} from 'nem2-sdk';

export function mosaicInfo(mosaicId, node) {
  return new MosaicHttp(node, NetworkType.TEST_NET).getMosaic(mosaicId);
}

export function getMosaicInfo(mosaicId, node) {
  const res = mosaicInfo(mosaicId, node);

  return (success, error) => {
    res.subscribe(res => {
      success(res);
    },
    err => {
      error(err);
    })
  }
}