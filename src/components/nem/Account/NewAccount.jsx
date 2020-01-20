import React, { useState } from 'react';
import { createNewAccount } from '../../../nem/account';
import { AppAccount } from '../../../helper';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import ObjMapList from '../../ObjMapList';

const NewAccount = () => {
  const [account, setAccount] = useState(
    new AppAccount({address: '', publicKey: '', privateKey: ''})
  );

  return (
    <div>
      <ContentsTitle title="アカウント作成" />
      <Button appearance="primary" onClick={ () => setAccount(new AppAccount(createNewAccount())) }>
        アカウント作成
      </Button>
      <ObjMapList obj={account} size={500}/>
    </div>
  )
}

export default NewAccount;