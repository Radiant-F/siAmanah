import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      dataSource: [],
      user: [],
      modal: false,
      photo: '',
      loading: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        console.log('token tersedia.');
        this.setState({token: token});
        this.getUser();
      } else {
        console.log('Tidak ada token. User harus login.');
      }
    });
  }

  getUserProduct() {
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/ambilah`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        if (responseJson[0] != 'anda belum menjual apapun') {
          this.setState({
            loading: false,
            dataSource: responseJson.produk,
          });
          console.log(this.state.dataSource);
        } else {
          this.setState({loading: false});
          console.log(responseJson[0]);
        }
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log(err);
      });
  }

  getUser() {
    console.log('sedang mengambil user..');
    fetch('https://si--amanah.herokuapp.com/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({user: responseJson.data});
        console.log(responseJson.data);
        this.getUserProduct();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createFormData(photo, body) {
    const data = new FormData();
    data.append('image', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
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

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.token != '' ? (
          <View style={styles.header}>
            <ImageBackground
              source={require('../assets/headerProfile.png')}
              style={styles.headerBg}>
              <Image
                source={require('../assets/user-account-box.png')}
                style={styles.headerIcon}
              />
              <Text style={styles.headerText}>
                Halo, {this.state.user.name}.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.replace('ProfileEdit', {
                    data: this.state.user,
                  })
                }>
                <Image
                  source={require('../assets/settings-cogwheel-button.png')}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        ) : (
          <View style={styles.header}>
            <ImageBackground
              source={require('../assets/headerProfile.png')}
              style={styles.headerBg}>
              <Image
                source={require('../assets/user-account-box.png')}
                style={styles.headerIcon}
              />
              <Text style={styles.headerText}>Halo, pengunjung.</Text>
            </ImageBackground>
          </View>
        )}
        <ImageBackground
          source={require('../assets/profileBg.png')}
          style={styles.BG}>
          {this.state.token == '' ? (
            <View style={{alignItems: 'center'}}>
              <View style={styles.viewIntro}>
                <Text style={{textAlign: 'center'}}>
                  Selamat datang di toko siAmanah! harap masuk atau daftar untuk
                  melihat dashboard Anda.
                </Text>
              </View>
              <View style={styles.viewBGs}>
                <TouchableOpacity
                  style={styles.touchRegister2}
                  onPress={() => this.props.navigation.replace('Login')}>
                  <Text style={styles.text}> Login </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchRegister}
                  onPress={() => this.props.navigation.replace('Register')}>
                  <Text style={styles.text}> Register </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: '95%',
                alignItems: 'center',
              }}>
              {this.state.user == '' ? (
                <View style={styles.viewLottie}>
                  <LottieView
                    source={require('../assets/8205-loading-animation.json')}
                    autoPlay={true}
                    style={{height: 120, alignItems: 'center'}}
                  />
                </View>
              ) : (
                <View style={styles.viewBG}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    onPress={() =>
                      this.props.navigation.replace('ProfileEdit', {
                        data: this.state.user,
                      })
                    }>
                    <Image
                      source={{uri: this.state.user.image}}
                      style={styles.pp}
                    />
                  </TouchableOpacity>
                  <Text style={styles.textDataUser}>
                    {this.state.user.name}
                  </Text>
                  <View style={styles.viewTextProfile}>
                    <Text style={styles.textProfile}>
                      Email: {this.state.user.email}
                    </Text>
                    <Text style={styles.textProfile}>
                      Alamat: {this.state.user.alamat}
                    </Text>
                    <Text style={styles.textProfile}>
                      No Telepon: {this.state.user.nomor_telpon}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}>
                    <Text style={styles.textProduct}> Produk Anda: </Text>
                    <View style={styles.viewProdukUser}>
                      <ScrollView horizontal={true}>
                        {this.state.dataSource == '' ? (
                          <View>
                            <LottieView
                              source={require('../assets/629-empty-box.json')}
                              autoPlay={true}
                              style={{height: 120}}
                            />
                          </View>
                        ) : (
                          <View style={styles.viewDataProduk}>
                            {this.state.dataSource.map((value, index) => (
                              <View
                                key={index}
                                style={styles.subViewDataProduk}>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.replace(
                                      'EditProduct',
                                      {data: value},
                                    )
                                  }>
                                  <Image
                                    source={{uri: value.image}}
                                    style={{
                                      width: 85,
                                      height: 85,
                                      borderRadius: 5,
                                      alignSelf: 'center',
                                    }}
                                  />
                                  <Text
                                    numberOfLines={1}
                                    style={styles.textDataProduk}>
                                    {value.name}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        )}
                      </ScrollView>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <TouchableOpacity
                        style={styles.touchToko}
                        onPress={() =>
                          this.props.navigation.replace('PesananPenjual')
                        }>
                        <Text style={styles.text}> Pesanan </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.touchToko}
                        onPress={() =>
                          this.props.navigation.replace('AddProduct')
                        }>
                        <Text style={styles.text}> Tambah Produk </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
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
    alignItems: 'center',
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
    marginVertical: 15,
    flex: 1,
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
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    width: '95%',
  },
  viewBGs: {
    backgroundColor: 'white',
    width: '90%',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  viewIntro: {
    marginBottom: 10,
    backgroundColor: 'white',
    width: '50%',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    padding: 15,
  },
  pp: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    marginTop: -120 / 2,
    borderColor: '#ffaa00',
    borderWidth: 5,
  },
  ppnt: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    marginTop: -120 / 2,
    borderColor: '#ffaa00',
    borderWidth: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  textUploadPp: {
    textAlign: 'center',
  },
  textDataUser: {
    fontWeight: 'bold',
    fontSize: 25,
    marginVertical: 5,
  },
  textProfile: {},
  viewTextProfile: {
    alignSelf: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  touchLogInOut: {
    width: 155,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
    borderRadius: 10,
    marginBottom: 10,
  },
  touchRegister: {
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffaa00',
    borderRadius: 10,
  },
  touchRegister2: {
    width: 90,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    borderRadius: 10,
  },
  touchToko: {
    width: 145,
    height: 45,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffaa00',
    borderRadius: 10,
    marginBottom: 15,
  },
  textProduct: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  viewProdukUser: {
    backgroundColor: 'white',
    width: '100%',
    height: 135,
    borderRadius: 5,
    padding: 10,
    marginVertical: 15,
    elevation: 2,
    alignItems: 'center',
  },
  viewDataProduk: {
    flexDirection: 'row',
  },
  subViewDataProduk: {
    width: 100,
    backgroundColor: '#00000026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 5,
    padding: 5,
  },
  textDataProduk: {
    textAlign: 'center',
  },
  viewLottie: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '95%',
  },
});

export default Profile;
