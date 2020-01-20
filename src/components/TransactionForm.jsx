import React from 'react';

import { TextInput } from 'evergreen-ui';

const TransactionFrom = (props) => {
  const handleChange = (e) => {
    switch (e.target.name) {
      case 'recipient':
        props.setForms(props.forms.set(props.formNum, 'recipient', e.target.value));
        break;

      case 'amount':
        props.setForms(props.forms.set(props.formNum, 'amount', e.target.value));
        break;

      case 'message':
        props.setForms(props.forms.set(props.formNum, 'message', e.target.value));
        break;

      default:
        return;
    }
  };

  const style = {
    margin: '15px 0px',
  };

  return (
    <div style={style}>
      <TextInput placeholder='recipient' name="recipient" onChange={handleChange} /><br />
      <TextInput placeholder='amount' name="amount" onChange={handleChange} /><br />
      <TextInput placeholder='message' name="message" onChange={handleChange} /><br />
    </div>
  )
}

export default TransactionFrom;