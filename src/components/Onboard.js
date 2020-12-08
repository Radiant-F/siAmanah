import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Onboard extends Component {
  constructor() {
    super();
    this.state = {
      isFirst: 'a',
    };
  }

  componentDidMount() {
    AsyncStorage.setItem('first', this.state.isFirst);
  }

  render() {
    return (
      <Onboarding
        onSkip={() => this.props.navigation.replace('Login')}
        onDone={() => this.props.navigation.replace('Login')}
        nextLabel="Lanjut"
        skipLabel="Lewati"
        bottomBarHighlight={false}
        pages={[
          {
            backgroundColor: '#4EC5F1',
            image: (
              <LottieView
                source={require('../assets/36605-shopping-cart.json')}
                style={styles.image}
                autoPlay={true}
                style={{width: 260}}
              />
            ),
            title: 'siAmanah',
            subtitle: 'Belanja dengan cepat, mudah dan aman.',
          },
          {
            backgroundColor: '#4EC5F1',
            image: (
              <LottieView
                source={require('../assets/20381-lock-check-open.json')}
                style={styles.image}
                loop={false}
                autoPlay={true}
                style={{width: 260}}
              />
            ),
            title: 'Privasi',
            subtitle: 'Keamanan dan kepuasan Anda adalah prioritas kami.',
          },
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  },
});

export default Onboard;
