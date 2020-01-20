import React from 'react';
import { Link } from 'react-router-dom';

import {
  Menu,
  Text,
} from 'evergreen-ui';

function MenuItems(props) {
  return props.linkConf.map((conf, i) => {
    return (
      <Menu.Item key={ i }>
        <Text  size={ 500 }>
          <Link to={ conf.to } onClick={ ()=> props.setMenu(false) }>{ conf.text }</Link>
        </Text>
      </Menu.Item>
    );
  })
}

export default MenuItems;