import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      token: '',
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
            console.log(token);
            this.props.navigation.replace('BottomTab', {screen: 'Home'});
          } else {
            alert('Pastikan data terisi dengan benar.');
          }
        })
        .catch((err) => {
          alert('Terjadi kesalahan. ' + err);
        });
    } else {
      alert('Harap diisi.'); // boleh ganti sama modal. keren tuh.
    }
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
                onPress={() => this.props.navigation.navigate('Recovery')}>
                <Text style={styles.subText}>Lupa Sandi?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => this.props.navigation.replace('Register')}>
                <Text style={styles.subText}>Register</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onChangeText={(input) => this.setState({email: input})}
              onPress={() => this.login()}>
              <View style={styles.viewTextLogin}>
                <Text style={styles.textLogin}>Masuk</Text>
              </View>
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
    width: 380,
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
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    marginTop: 10,
    borderRadius: 10,
  },
  textLogin: {
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
