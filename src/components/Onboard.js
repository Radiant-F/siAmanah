import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';

class Onboard extends Component {
  render() {
    return (
      <Onboarding
        onSkip={() => this.props.navigation.replace('BottomTab')}
        onDone={() => this.props.navigation.replace('BottomTab')}
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
