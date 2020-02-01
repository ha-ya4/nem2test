import React from 'react';
import Mosaic from './mosaic';

import SingleForm from '../SingleForm';

const MosaicInfo = (props) => {
  const func = (setResult, node, value) => {
    new Mosaic(setResult, node).getMosaicInfo(value);
  };

  return (
    <div>
      <SingleForm title="モザイク情報" placeholder='mosaic id' name='mosaicId' click={func} />
    </div>
  )
}

export default MosaicInfo;