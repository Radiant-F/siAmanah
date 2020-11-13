import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// SCREENS
import HomePage from '../screens/HomePage';
import Profile from '../screens/Profile';
import Transaction from '../screens/Transaction';
import Chat from '../screens/Chat';

const Tab = createMaterialBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      backBehavior="Home"
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
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Pesan',
          tabBarIcon: ({color}) => (
            <Icon name="forum" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
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
