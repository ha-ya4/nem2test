import React, { useState } from 'react';
import { createMultisigAccount } from '../../../nem/account';
import { handleNewMultisigResult } from './accountHelper';
import { ResultState, StateManager, MultisigAccountConf } from '../../../js/helper';
import { useResultState } from '../../../js/hooks';

import { Button, Text } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const NewMultisigAccount = (props) => {
  const [conf, setConf] = useState(new StateManager(1, new MultisigAccountConf('', '', 0, 0)));
  const [privatekeys, setPrivatekeys] = useState(new StateManager(1, {privatekey: ''}));
  const rs = useResultState();

  return (
    <div>
      <ContentsTitle title="マルチシグアカウント作成" />

      {
        Object.keys(conf.states).map(name => {
          return <FormManager
                   key={name}
                   states={conf}
                   state={conf.states[name]}
                   set={setConf}
                   num={name}
                   exclude={['cosignatoryPrivateKeys']}
                   />
        })
      }
      <Text>連署者</Text>
      {
        Object.keys(privatekeys.states).map(name => {
          return <FormManager
                   key={name}
                   states={privatekeys}
                   state={privatekeys.states[name]}
                   set={setPrivatekeys}
                   num={name}
                  />
        })
      }

      <Button
        appearance="primary"
        marginRight={3}
        onClick={ () => setPrivatekeys(privatekeys.add({privatekey:''}))}
      >
        パブリックキー追加
      </Button>

      <Button
        appearance="primary"
        onClick={ () => {
          rs.setResult(
            new ResultState(true, false, {}, '', '')
          );
          conf.states[1].setPrivateKeysToArray(privatekeys.states)
          handleNewMultisigResult(
            createMultisigAccount(conf.states[1], window.catapultNode), rs
          );
        }}
      >
        作成
      </Button>
      <Result result={rs} />
    </div>
  )
}

export default NewMultisigAccount;