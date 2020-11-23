import React, {Component} from 'react';
import LottieView from 'lottie-react-native';
import TopTab from '../router/TopTab';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Transaction extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      loading: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((value) => {
      if (value != null) {
        this.setState({token: value});
        // this.checkout()
      } else {
        console.log('Token tidak tersedia.');
      }
    });
  }

  checkout() {}

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/headerTransaction.png')}
            style={styles.headerBg}>
            <Image
              source={require('../assets/transaksi.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerText}>Transaksi</Text>
          </ImageBackground>
        </View>
        <View style={{flex: 1}}>
          <TopTab />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4EC5F1',
    // height: 60,
    // alignItems: 'center',
    // paddingHorizontal: 20,
    // flexDirection: 'row',
  },
  headerBg: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    resizeMode: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  headerIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  viewTextPurchase: {
    width: 290,
    height: 55,
    backgroundColor: '#4EC5F1',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  textPurchase: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
});

export default Transaction;
