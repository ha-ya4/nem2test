import React, { useState } from 'react';
import Mosaic from './mosaic';
import { StateManager, getPrivateKey } from '../../../js/helper';
import { MosaicConf } from '../../../js/dataclass';
import ResultState from '../../../js/resultstate';

import { Button, Pane, Checkbox } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const NewMosaic = (props) => {
  const [conf, setConf] = useState(new StateManager(1, MosaicConf.init()));
  const [result, setResult] = useState(ResultState.init());

  const handleChange = (e) => {
    setConf(conf.set(1, e.target.name, e.target.checked));
  };

  return (
    <div>
      <ContentsTitle title="モザイク作成" />

      <FormManager
        states={conf}
        state={conf.states[1]}
        set={setConf}
        num='1'
        exclude={['supplyMutable', 'transferable', 'restrictable']}
      />

      <Pane>
        <Checkbox label='supplyMutable' name='supplyMutable' checked={conf.states[1].supplyMutable} onChange={handleChange}/>
        <Checkbox label='transferable' name='transferable' checked={conf.states[1].transferable} onChange={handleChange} />
        <Checkbox label='restrictable' name='restrictable' checked={conf.states[1].restrictable} onChange={handleChange} />
      </Pane>

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          setResult(ResultState.loading());
          new Mosaic(setResult, window.catapultNode).newMosaic(getPrivateKey(), conf.states[1]);
        }}
      >
        作成
      </Button>

      <Result result={result} />
    </div>
  )
}

export default NewMosaic;