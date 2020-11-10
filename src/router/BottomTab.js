import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// SCREENS
import HomePage from '../screens/HomePage';
import Profile from '../screens/Profile';
import Whishlist from '../screens/Whishlist';
import Transaction from '../screens/Transaction';

const Tab = createMaterialBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior={'initialRoute'}
      activeColor="blue"
      screenOptions={{
        tabBarColor: '#4EC5F1',
      }}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: 'Rumah',
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={25} />,
        }}
      />
      <Tab.Screen
        name="Whishlist"
        component={Whishlist}
        options={{
          tabBarColor: 'red',
          tabBarLabel: 'Favorit',
          tabBarIcon: ({color}) => (
            <Icon name="heart-outline" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarColor: 'green',
          tabBarLabel: 'Transaksi',
          tabBarIcon: ({color}) => (
            <Icon name="cart-outline" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({color}) => (
            <Icon name="home-account" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
