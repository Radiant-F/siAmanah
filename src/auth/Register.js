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
} from 'react-native';

export class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      confirmEmail: '',
      password: '',
      token: '',
    };
  }

  Register() {
    const {name, email, password, ulangiPassword} = this.state;

    var dataToSend = {
      name: name,
      email: email,
      password: password,
      password_confirmation: ulangiPassword,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch('http://restful-api-laravel-7.herokuapp.com/api/register', {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const {token} = responseJson;
        if (token) {
          alert('Success');
          this.props.navigation.goBack();
        } else {
          alert('Pastikan formulir terisi dengan benar');
        }
      })
      .catch((error) => {
        alert('Terjadi kesalahan. ' + error);
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('../assets/splashBG.jpg')}
          style={styles.mainView}>
          <View style={styles.viewLogin}>
            <Text style={styles.text}> Register </Text>
            <View style={styles.viewInput}>
              <Image
                source={require('../assets/round-account-button-with-user-inside.png')}
                style={styles.icon}
              />
              <TextInput
                style={{flex: 1}}
                placeholder="Nama"
                onChangeText={(input) => this.setState({email: input})}
              />
            </View>
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
                source={require('../assets/black-envelope-email-symbol.png')}
                style={styles.icon}
              />
              <TextInput
                style={{flex: 1}}
                placeholder="Konfirmasi Email"
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
                placeholder="Kata Sandi"
                onChangeText={(input) => this.setState({password: input})}
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity
              style={{
                width: 300,
              }}
              onPress={() => this.props.navigation.replace('Login')}>
              <Text style={styles.subText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.replace('BottomTab')}>
              <View style={styles.viewTextLogin}>
                <Text style={styles.textLogin}>Daftar</Text>
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

export default Register;
