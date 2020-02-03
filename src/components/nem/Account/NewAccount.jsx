import React, { useState } from 'react';
import Account from './js/account';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import ObjMapList from '../../ObjMapList';

const NewAccount = () => {
  const [account, setAccount] = useState({address: '', publicKey: '', privateKey: ''});

  return (
    <div>
      <ContentsTitle title="アカウント作成" />
      <Button appearance="primary"
        onClick={ () => {
          const account = Account.createNewAccount();
          setAccount({address: account.address.address, publicKey: account.publicKey, privateKey: account.privateKey});
        }
      }>
        アカウント作成
      </Button>
      <ObjMapList obj={account} size={500}/>
    </div>
  )
}

export default NewAccount;