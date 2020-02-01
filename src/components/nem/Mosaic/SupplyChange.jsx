import React, { useState } from 'react';
import Mosaic from './mosaic';
import { StateManager, getPrivateKey } from '../../../js/helper';
import ResultState from '../../../js/resultstate';

import { Button, Pane, Radio } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const SupplyChange = (props) => {
  const [conf, setConf] = useState(new StateManager(1, {mosaicId:'', supply:0}));
  const [action, setAction] = useState(1);
  const [radio, setRadio] = useState({inc:true, dec:false});
  const [result, setResult] = useState(ResultState.init());

  const handleChange = (e) => {
    setAction(parseInt(e.target.value));
    switch (e.target.name) {
      case 'increase':
        setRadio({inc:true, dec:false});
        break;

      case 'decrease':
        setRadio({inc:false, dec:true});
        break;

      default:
        return;
    }
  };

  return (
    <div>
      <ContentsTitle title="モザイク供給変更" />

      <FormManager
        states={conf}
        state={conf.states[1]}
        set={setConf}
        num='1'
      />

      <Pane>
        <Radio size={16} name="increase" label="increase" value="1" onChange={handleChange} checked={radio.inc}/>
        <Radio size={16} name="decrease" label="decrease" value="0" onChange={handleChange} checked={radio.dec}/>
      </Pane>

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          setResult(ResultState.loading());
          new Mosaic(setResult, window.catapultNode).supplyChange(getPrivateKey(), conf.states[1], action);
        }}
      >
        作成
      </Button>

      <Result result={result} />
    </div>
  )
}

export default SupplyChange;