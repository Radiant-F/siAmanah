import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import editProfile from '../screens/toko/editProfile';
import editShop from '../screens/toko/editShop';

const Tabs = createMaterialTopTabNavigator();

const TopTab = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Profil Anda" component={editProfile} />
      <Tabs.Screen name="Toko Anda" component={editShop} />
    </Tabs.Navigator>
  );
};

export default TopTab;
