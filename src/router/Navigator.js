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
import Chat from '../screens/Chat';
import ScreenBooks from '../screens/categories/ScreenBooks';
import ScreenClothes from '../screens/categories/ScreenClothes';
import ScreenElektronics from '../screens/categories/ScreenElektronics';
import DetailProduct from '../screens/ProductDetail';
import OpenStore from '../screens/OpenStore';
import ProfileEdit from '../screens/ProfileEdit';
import AddProduct from '../screens/ProductAdd';
import EditProoduct from '../screens/ProductEdit';
import PesananPenjual from '../screens/PesananPenjual';
import ChatScreen from '../screens/ChatScreen';
import Nota from '../screens/Nota';
import DetailOrder from '../screens/topTab/BOrderDetail';
import ProductSearch from '../screens/ProductSearch';

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
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Books" component={ScreenBooks} />
        <Stack.Screen name="Clothes" component={ScreenClothes} />
        <Stack.Screen name="Electronics" component={ScreenElektronics} />
        <Stack.Screen name="Detail" component={DetailProduct} />
        <Stack.Screen name="OpenStore" component={OpenStore} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="EditProduct" component={EditProoduct} />
        <Stack.Screen name="PesananPenjual" component={PesananPenjual} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Nota" component={Nota} />
        <Stack.Screen name="OrderDetail" component={DetailOrder} />
        <Stack.Screen name="ProductSearch" component={ProductSearch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
