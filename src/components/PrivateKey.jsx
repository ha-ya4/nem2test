import React, { useState } from 'react';

import { Button, TextInput, toaster } from 'evergreen-ui';

const PrivateKey = (props) => {
  const [privateKey, setPrivateKey] = useState('');

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'privateKey':
        setPrivateKey(e.target.value);
        break;

      default:
        return;
    }
  };

  return (
    <div>
      <TextInput placeholder="privatekey" name="privateKey"　value={privateKey} onChange={handleChange} />
      <Button
        appearance="primary"
        onClick={ () => {
          localStorage.setItem('privateKey', privateKey);
          setPrivateKey('');
          toaster.success('ローカルストレージに保存しました')
        }}
      >
        保存
      </Button>
    </div>
  )
}

export default PrivateKey;