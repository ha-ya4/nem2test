import React from 'react';
import Mosaic from './mosaic';

import SingleForm from '../SingleForm';

const MosaicInfo = (props) => {
  const func = (setResult, node, value) => {
    new Mosaic(setResult, node)
  };

  return (
    <div>
      <SingleForm title="モザイク情報" placeholder='name' name='name' click={func} />
    </div>
  )
}

export default MosaicInfo;