import React, { useState } from 'react';
import { SendParams, ResultState, StateManager, FormState, getPrivateKey } from '../../../js/helper';
import { handleResult } from './transHelper';
import { useResultState } from '../../../js/hooks';
import { transfer } from '../../../nem/transactions';

import { Button } from 'evergreen-ui';
import FormManager from '../../FormManager';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const AppTransferTransaction = () => {
  const [forms, setForms] = useState(new StateManager(1, FormState.init()));
  const rs = useResultState();

  return (
    <div>
      <ContentsTitle title="TransferTransaction" />
      {
        Object.keys(forms.states).map(name => {
          return <FormManager  key={name} states={forms} state={forms.states[name]} set={setForms} num={name}/>
        })
      }

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          rs.setResult(
            new ResultState(true, false, {}, '', '')
          );
          const f = forms.states
          const params = new SendParams(f[1].recipient, f[1].amount, f[1].message)
          handleResult(
            transfer(params, getPrivateKey(), window.catapultNode), rs, window.catapultNode
          );
        }}
      >
        送金
      </Button>

      <Result result={rs} />
    </div>
  )
}

export default AppTransferTransaction;




