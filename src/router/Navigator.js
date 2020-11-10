import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// SCREENS
import Register from '../auth/Register';
import SplashLogin from '../auth/Login';
import BottomTab from '../router/BottomTab';
import Recovery from '../auth/Recovery';
import Onboard from '../components/Onboard';
import Splash from '../components/Splash';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={false}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="Login" component={SplashLogin} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Recovery" component={Recovery} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
