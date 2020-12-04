import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Cart from '../screens/topTab/ACart';
import Status from '../screens/topTab/BStatus';
import Histori from '../screens/topTab/CHistory';

const Tabs = createMaterialTopTabNavigator();

const TopTab = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Keranjang" component={Cart} />
      <Tabs.Screen name="Pembayaran" component={Status} />
      <Tabs.Screen name="Status" component={Histori} />
    </Tabs.Navigator>
  );
};

export default TopTab;
