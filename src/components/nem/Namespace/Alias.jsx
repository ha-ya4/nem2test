import React, { useState } from 'react';
import { StateManager, getPrivateKey } from '../../../js/helper';
import ResultState from '../../../js/resultstate';
import Namespace from './namespace';

import { Button, Text } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const Alias = (props) => {
  const [address, setAddress] = useState(new StateManager(1, {namespace: '', address:''}));
  const [mosaic, setMosaic] = useState(new StateManager(1, {namespace: '', mosaicId:''}));
  const [result, setResult] = useState(ResultState.init());


  return (
    <div>
      <ContentsTitle title="ネームスペースエイリアス" />

      <div>
        <Text>アドレスエイリアス</Text>
        {
          Object.keys(address.states).map(name => {
            return <FormManager  key={name} states={address} state={address.states[name]} set={setAddress} num={name}/>
          })
        }

        <Button
          appearance="primary"
          marginTop={10}
          onClick={ () => {
            setResult(ResultState.loading());
          }}
        >
          作成
        </Button>
      </div>

      <div style={{marginTop: '30px'}}>
        <Text>モザイクエイリアス</Text>
        {
          Object.keys(mosaic.states).map(name => {
            return <FormManager  key={name} states={mosaic} state={mosaic.states[name]} set={setMosaic} num={name}/>
          })
        }

        <Button
          appearance="primary"
          marginTop={10}
          onClick={ () => {
            setResult(ResultState.loading());
          }}
        >
          作成
        </Button>
      </div>

      <Result result={result} />
    </div>
  )
}

export default Alias;