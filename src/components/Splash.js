import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, Image, StyleSheet, ImageBackground} from 'react-native';

class Splash extends Component {
  componentDidMount() {
    setTimeout(() => {
      AsyncStorage.getItem('first')
        .then((value) => {
          if (value !== null) {
            console.log(value, 'Bukan pertama kali. Memeriksa token...');
            this.onboardCheck();
            // this.props.navigation.replace('BottomTab');
          } else {
            console.log('Pertama kali. Menuju onboard.');
            this.props.navigation.replace('Onboard');
          }
        })
        .catch((err) => console.log(err));
    }, 1000);
  }

  onboardCheck() {
    AsyncStorage.getItem('token')
      .then((value) => {
        if (value !== null) {
          console.log(value, '. Token tersedia.');
          this.props.navigation.replace('BottomTab');
        } else {
          console.log('Tidak ada token.');
          this.props.navigation.replace('Login');
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('../assets/splashBG.jpg')}
          style={styles.viewMain}>
          <Image
            source={require('../assets/logoToko.png')}
            style={{width: 200, height: 200}}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default Splash;
