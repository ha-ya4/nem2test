import React from 'react';
import MosaicMetadata from './js/mosaicMetadata';

import SingleForm from '../SingleForm';

const MosaicMetadataInfo = (props) => {
  const func = (setResult, node, value) => {
    new MosaicMetadata(setResult, node).getMetadataInfo(value);
  };

  return (
    <div>
      <SingleForm title="モザイクメタデータ情報" placeholder="mosaic id" name="mosaicId" click={func} />
    </div>
  )
}

export default MosaicMetadataInfo;