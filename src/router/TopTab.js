import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Cart from '../screens/topTab/ACart';
import Status from '../screens/topTab/CStatus';
import Histori from '../screens/topTab/DHistory';

const Tabs = createMaterialTopTabNavigator();

const TopTab = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Keranjang" component={Cart} />
      <Tabs.Screen name="Status" component={Status} />
      <Tabs.Screen name="Histori" component={Histori} />
    </Tabs.Navigator>
  );
};

export default TopTab;
