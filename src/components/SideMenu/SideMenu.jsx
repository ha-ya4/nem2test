import React, { useState } from 'react';
import { link } from "../../router";

import {
  Button,
  SideSheet,
  Icon,
  Position,
  Pane,
  Heading,
  Menu,
} from 'evergreen-ui';
import MenuItems from './MenuItems';

const SideMenu = (props) => {
  const [menu, setMenu] = useState(false);

  return (
    <div className="App">
      <Button className="menu-button" type="button" onClick={ () => setMenu(true) }>
        <Icon icon="menu"/>
      </Button>

      <SideSheet
        isShown={ menu }
        position={ Position.LEFT }
        width={ props.width }
        onCloseComplete={ () => setMenu(false)
      }>

        <Pane height={ window.innerHeight } backgroundColor="#F7F9FD">

          <Pane padding={15} borderBottom="muted">
            <Heading size={ 800 }>Menu</Heading>
          </Pane>

          <Menu>
            <MenuItems linkConf={link} setMenu={setMenu}/>
          </Menu>

        </Pane>

      </SideSheet>
    </div>
  );
}

export default SideMenu;