import React, { useState } from 'react';
import Multisig from './js/multisig';
import { StateManager , MultisigSendParams} from '../../../js/helper';
import { TransactionParamsState as TransPramState } from '../../../js/dataclass';
import ResultState from '../../../js/resultstate';

import { Button, Text, TextInput } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const MultisigTransaction = (props) => {
  const [forms, setForms] = useState(new StateManager(1, TransPramState.init()));
  const [multisigPubKey, setMultisigPubKey] = useState('');
  const [privatekeys, setPrivatekeys] = useState(new StateManager(1, {privatekey: ''}));
  const [result, setResult] = useState(ResultState.init());

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'multisigPubKey':
        setMultisigPubKey(e.target.value);
        break;

      default:
        return;
    }
  };

  return (
    <div>
      <ContentsTitle title="MultisigTransaction" />

      {
        Object.keys(forms.states).map(name => {
          return <FormManager  key={name} states={forms} state={forms.states[name]} set={setForms} num={name}/>
        })
      }

      <div style={{margin: "15px 0px"}}>
        <TextInput placeholder="multisig acoount publickey" name="multisigPubKey"　value={multisigPubKey} onChange={handleChange} />
      </div>

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
        連署者追加
      </Button>

      <Button
        appearance="primary"
        onClick={ () => {
          setResult(ResultState.loading());
          const params = new MultisigSendParams(forms.states[1].recipient, forms.states[1].amount, forms.states[1].message, multisigPubKey, '');
          params.setPrivateKeysToArray(privatekeys.states);
          new Multisig(setResult, window.catapultNode).send(params);
        }}
      >
        送金
      </Button>

      <Result result={result} />
    </div>
  )
}

export default MultisigTransaction;