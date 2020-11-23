import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Cart from '../screens/topTab/ACart';
import Checkout from '../screens/topTab/BCheckout';
import History from '../screens/topTab/DHistory';
import Status from '../screens/topTab/CStatus';

const Tabs = createMaterialTopTabNavigator();

const TopTab = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Keranjang" component={Cart} />
      <Tabs.Screen name="Status" component={Status} />
      <Tabs.Screen name="History" component={History} />
    </Tabs.Navigator>
  );
};

export default TopTab;
