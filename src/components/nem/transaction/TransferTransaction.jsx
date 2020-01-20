import React, { useState } from 'react';
import { SendParams, ResultState, FormStateManager, getPrivateKey } from '../../../helper';
import { handleResult } from './transHelper';
import { useResultState } from '../../../hooks';
import { transfer } from '../../../nem/transactions';

import { Button } from 'evergreen-ui';
import TransactionForm from '../../TransactionForm';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const AppTransferTransaction = () => {
  const [forms, setForms] = useState(new FormStateManager(1));
  const rs = useResultState();

  return (
    <div>
      <ContentsTitle title="TransferTransaction" />
      <TransactionForm  forms={forms} setForms={setForms} formNum={1}/>

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          rs.setResult(
            new ResultState(true, false, {}, '', '')
          );
          const f = forms.forms
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




