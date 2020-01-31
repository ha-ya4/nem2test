import React from 'react';
import MultisigAccount from './js/multisig-account';

import SingleForm from '../SingleForm';

const MultisigAccountInfo = (props) => {
  const func = (setResult, node, value) => {
    new MultisigAccount(setResult, node).getMultisigAccountInfo(value);
  };

  return (
    <div>
      <SingleForm title="マルチシグアカウント情報" placeholder='address' name='address' click={func} />
    </div>
  )
}

export default MultisigAccountInfo;