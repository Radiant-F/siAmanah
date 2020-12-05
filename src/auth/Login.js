import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ToastAndroid,
} from 'react-native';
import LottieView from 'lottie-react-native';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      token: '',
      loading: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token')
      .then((value) => {
        if (value !== null) {
          this.props.navigation.replace('BottomTab');
        }
      })
      .catch((err) => console.log(err));
  }

  login() {
    if (this.state.email != '' && this.state.password != '') {
      const {email, password} = this.state;
      const kirimData = {email: email, password: password};
      this.setState({loading: true});
      fetch('https://si--amanah.herokuapp.com/api/login', {
        method: 'POST',
        body: JSON.stringify(kirimData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          console.log(responseJSON);
          const {token} = responseJSON;
          if (token) {
            AsyncStorage.setItem('token', token);
            this.setState({loading: false});
            this.props.navigation.replace('BottomTab', {screen: 'Home'});
          } else {
            this.setState({loading: false});
            this.alert();
          }
        })
        .catch((err) => {
          this.setState({loading: false});
          alert('Terjadi kesalahan. ' + err);
        });
    } else {
      ToastAndroid.show('Harap isi semua form', ToastAndroid.SHORT);
    }
  }

  alert() {
    Alert.alert(
      'Perhatian',
      'Pastikan data terisi dengan benar!',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('../assets/splashBG.jpg')}
          style={styles.mainView}>
          <View style={styles.viewLogin}>
            <Text style={styles.text}> Login </Text>
            <View style={styles.viewInput}>
              <Image
                source={require('../assets/black-envelope-email-symbol.png')}
                style={styles.icon}
              />
              <TextInput
                keyboardType={'email-address'}
                style={{flex: 1}}
                placeholder="Email"
                onChangeText={(input) => this.setState({email: input})}
              />
            </View>
            <View style={styles.viewInput}>
              <Image
                source={require('../assets/locked-padlock.png')}
                style={styles.icon}
              />
              <TextInput
                style={{flex: 1}}
                placeholder="Password"
                onChangeText={(input) => this.setState({password: input})}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.textRegister}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => this.props.navigation.replace('Recovery')}>
                <Text style={styles.subText}>Lupa Sandi?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => this.props.navigation.replace('Register')}>
                <Text style={styles.subText}>Register</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.login()}>
              {this.state.loading ? (
                <LottieView
                  source={require('../assets/8205-loading-animation.json')}
                  autoPlay={true}
                  style={{width: 60, height: 60}}
                />
              ) : (
                <View style={styles.viewTextLogin}>
                  <Text style={styles.textLogin}>Masuk</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  viewLogin: {
    width: '95%',
    backgroundColor: '#ffffff',
    elevation: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: '#4EC5F1',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  viewInput: {
    flexDirection: 'row',
    height: 50,
    width: 300,
    backgroundColor: '#0000001a',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
    // borderRightColor: '#000000',
    // borderRightWidth: 1,
  },
  textRegister: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subText: {
    fontWeight: 'bold',
    color: '#8f8f8f',
  },
  viewTextLogin: {
    width: 170,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    marginTop: 10,
    borderRadius: 10,
  },
  textLogin: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
});

export default Login;
