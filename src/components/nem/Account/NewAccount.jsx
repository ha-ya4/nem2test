import React, { useState } from 'react';
import Account from './js/account';
import { AccountConf } from '../../../js/dataclass';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import ObjMapList from '../../ObjMapList';

const NewAccount = () => {
  const [account, setAccount] = useState(
    new AccountConf({address: '', publicKey: '', privateKey: ''})
  );

  return (
    <div>
      <ContentsTitle title="アカウント作成" />
      <Button appearance="primary" onClick={ () => setAccount(new AccountConf(Account.createNewAccount())) }>
        アカウント作成
      </Button>
      <ObjMapList obj={account} size={500}/>
    </div>
  )
}

export default NewAccount;