import React from 'react';
import Namespace from './namespace';

import SingleForm from '../SingleForm';

const NamespaceInfo = (props) => {
  const func = (setResult, node, value) => {
    new Namespace(setResult, node).getNamespaceInfo(value);
  };

  return (
    <div>
      <SingleForm title="ネームスペース情報" placeholder='name' name='name' click={func} />
    </div>
  )
}

export default NamespaceInfo;