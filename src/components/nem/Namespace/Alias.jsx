import React, { useState } from 'react';
import { StateManager, getPrivateKey } from '../../../js/helper';
import ResultState from '../../../js/resultstate';
import Namespace from './namespace';

import { Button, Text, Pane, Radio, TextInput } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const Alias = (props) => {
  const [namespace, setNamespace] = useState('');
  const [value, setValue] = useState('');
  const [action, setAction] = useState(1);
  const [aliasTypeRadio, setAliasTypeRadio] = useState({address:true, mosaic:false});
  const [actionRadio, setActionRadio] = useState({link:true, unlink:false});
  const [result, setResult] = useState(ResultState.init());

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'namespace':
        setNamespace(e.target.value);
        break;

      case 'addressOrMosaic':
        setValue(e.target.value);
        break;

      case 'addressAlias':
        setAliasTypeRadio({address:true, mosaic:false});
        break;

      case 'mosaicAlias':
        setAliasTypeRadio({address:false, mosaic:true});
        break;

      case 'link':
        setActionRadio({link:true, unlink:false});
        setAction(parseInt(e.target.value));
        break;

      case 'unlink':
        setActionRadio({link:false, unlink:true});
        setAction(parseInt(e.target.value));
        break;

      default:
        return;
    }
  };


  return (
    <div>
      <ContentsTitle title="ネームスペースエイリアス" />

      <TextInput placeholder='namespace'  name='namespace' onChange={handleChange} /><br />
      <TextInput placeholder='address or mosaicId'  name='addressOrMosaic' onChange={handleChange} />
      <Pane>
        <Radio size={16} name="addressAlias" label="address" onChange={handleChange} checked={aliasTypeRadio.address}/>
        <Radio size={16} name="mosaicAlias" label="mosaic" onChange={handleChange} checked={aliasTypeRadio.mosaic}/>
      </Pane>

      <Pane>
        <Radio size={16} name="link" label="link" value="1" onChange={handleChange} checked={actionRadio.link}/>
        <Radio size={16} name="unlink" label="unlink" value="0"  onChange={handleChange} checked={actionRadio.unlink}/>
      </Pane>

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          setResult(ResultState.loading());
          new Namespace(setResult, window.catapultNode).alias(getPrivateKey(), namespace, value, aliasTypeRadio, action);
        }}
      >
        作成
      </Button>

      <Result result={result} />
    </div>
  )
}

export default Alias;