import React from 'react';
import Account from './js/account';

import SingleForm from '../SingleForm';

const AccountInfo = (props) => {
  const func = (setResult, node, value) => {
    new Account(setResult, node).getAccountInfo(value);
  };

  return (
    <div>
      <SingleForm title='アカウント情報' placeholder='address' name='address' click={func} />
    </div>
  )
}

export default AccountInfo;