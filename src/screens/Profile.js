import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export class Profile extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      dataSource: [],
      photo: '',
    };
    console.log('constructor');
  }

  componentDidMount() {
    console.log('didmount');
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        console.log('cek token');
        this.setState({token: token});
      } else {
        console.log('cek token false');
        console.log('Tidak ada token. User harus login.');
      }
    });
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({photo: response});
      }
    });
  };

  logout() {
    AsyncStorage.clear();
    this.props.navigation.replace('Login');
  }

  render() {
    console.log('render');
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../assets/user-account-box.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Halo, Radiant.</Text>
        </View>
        <ImageBackground
          blurRadius={5}
          source={require('../assets/profileBg.png')}
          style={styles.BG}>
          {this.state.token == '' ? (
            <View style={styles.viewBG}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => this.handleChoosePhoto()}>
                {this.state.photo !== '' ? (
                  <Image
                    source={{uri: this.state.photo.uri}}
                    style={styles.pp}
                  />
                ) : (
                  <View style={styles.ppnt}>
                    <Text style={styles.textUploadPp}>Pilih foto</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchLogInOut}
                onPress={() => this.props.navigation.navigate('Login')}>
                <Text style={styles.text}> Login </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.viewBG}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => this.handleChoosePhoto()}>
                {this.state.photo !== '' ? (
                  <Image
                    source={{uri: this.state.photo.uri}}
                    style={styles.pp}
                  />
                ) : (
                  <View style={styles.ppnt}>
                    <Text style={styles.textUploadPp}>Pilih foto</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.textProfile}>Muhammad Radiant Fadilah</Text>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}>
                <TouchableOpacity
                  style={styles.touchLogInOut}
                  onPress={() => this.logout()}>
                  <Text style={styles.text}> Logout </Text>
                </TouchableOpacity>
                <Text style={styles.textProduct}> Produk Anda: </Text>
                <TouchableOpacity style={styles.touchToko}>
                  <Text style={styles.text}> Tambah Produk! </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4EC5F1',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  headerIcon: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  BG: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBG: {
    backgroundColor: 'white',
    width: '90%',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    paddingBottom: 10,
  },
  pp: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    marginTop: -120 / 2,
    borderColor: '#4EC5F1',
    borderWidth: 7,
  },
  ppnt: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    marginTop: -120 / 2,
    borderColor: '#ffaa00',
    borderWidth: 7,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  textUploadPp: {
    textAlign: 'center',
  },
  textProfile: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  touchLogInOut: {
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    borderRadius: 10,
    marginTop: 10,
  },
  touchToko: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffaa00',
    borderRadius: 10,
  },
  textProduct: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  text: {
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

export default Profile;
