import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// SCREENS
import Register from '../auth/Register';
import Login from '../auth/Login';
import BottomTab from '../router/BottomTab';
import Recovery from '../auth/Recovery';
import Onboard from '../components/Onboard';
import Splash from '../components/Splash';
import Cart from '../screens/Cart';
import Chat from '../screens/Chat';
import Favorite from '../screens/Favorite';
import ScreenAntique from '../screens/ScreenAntique';
import ScreenBooks from '../screens/ScreenBooks';
import ScreenClothes from '../screens/ScreenClothes';
import ScreenElektronics from '../screens/ScreenElektronics';
import ScreenFoods from '../screens/ScreenFoods';
import ScreenFurniture from '../screens/ScreenFurniture';
import DetailProduct from '../screens/DetailProduct';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={false}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Recovery" component={Recovery} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name="Antique" component={ScreenAntique} />
        <Stack.Screen name="Books" component={ScreenBooks} />
        <Stack.Screen name="Clothes" component={ScreenClothes} />
        <Stack.Screen name="Electronics" component={ScreenElektronics} />
        <Stack.Screen name="Foods" component={ScreenFoods} />
        <Stack.Screen name="Furnitures" component={ScreenFurniture} />
        <Stack.Screen name="Detail" component={DetailProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
