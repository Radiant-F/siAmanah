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
      user: '',
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
        console.log(this.state.user);
        this.getUserProduct();
      })
      .catch((err) => {
        console.log(err);
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

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/headerProfile.png')}
            style={styles.headerBg}>
            <Image
              source={require('../assets/user-account-box.png')}
              style={styles.headerIcon}
            />
            {this.state.user == '' ? (
              <Text style={styles.headerText}>Halo, pengunjung.</Text>
            ) : (
              <Text style={styles.headerText}>
                Halo, {this.state.user.name}.
              </Text>
            )}
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
        <ImageBackground
          source={require('../assets/profileBg.png')}
          style={styles.BG}>
          <View style={styles.viewBG}>
            {this.state.user == '' ? (
              <View style={styles.viewLottie}>
                <LottieView
                  source={require('../assets/8205-loading-animation.json')}
                  autoPlay={true}
                  style={{height: 120}}
                />
              </View>
            ) : (
              <View style={styles.viewMainProfile}>
                <TouchableOpacity
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
                <Text style={styles.textDataUser}>{this.state.user.name}</Text>
                <View style={styles.viewTextProfile}>
                  <View style={styles.viewData}>
                    <Image
                      source={require('../assets/black-envelope-email-symbol.png')}
                      style={styles.iconProfile}
                    />
                    <Text style={styles.textProfile}>
                      {this.state.user.email}
                    </Text>
                  </View>
                  {this.state.user.alamat == null ? (
                    <View></View>
                  ) : (
                    <View style={styles.viewData}>
                      <Image
                        source={require('../assets/map-placeholder.png')}
                        style={styles.iconProfile}
                      />
                      <Text style={styles.textProfile}>
                        {this.state.user.alamat}
                      </Text>
                    </View>
                  )}
                  {this.state.user.nomor_telpon == null ? (
                    <View style={{marginTop: -10}}></View>
                  ) : (
                    <View style={styles.viewData2}>
                      <Image
                        source={require('../assets/phone-working-indicator.png')}
                        style={styles.iconProfile}
                      />
                      <Text style={styles.textProfile}>
                        {this.state.user.nomor_telpon}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.viewMyProduct}>
                  <Text style={styles.textProduct}> Produk Anda: </Text>
                  <View style={styles.viewProdukUser}>
                    <ScrollView horizontal={true}>
                      {this.state.user.role == null ? (
                        <TouchableOpacity
                          style={styles.openStore}
                          onPress={() =>
                            this.props.navigation.replace('OpenStore')
                          }>
                          <Text style={styles.textOpenStore}>
                            Buka toko untuk mulai berjualan!
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View>
                          {this.state.dataSource == '' ? (
                            <LottieView
                              source={require('../assets/629-empty-box.json')}
                              autoPlay={true}
                              style={{height: 100}}
                            />
                          ) : (
                            <View style={styles.subViewDataProduk}>
                              {this.state.dataSource.map((value, index) => (
                                <TouchableOpacity
                                  style={styles.viewDataProduk}
                                  key={index}
                                  onPress={() =>
                                    this.props.navigation.replace(
                                      'EditProduct',
                                      {
                                        data: value,
                                      },
                                    )
                                  }>
                                  <Image
                                    source={{uri: value.image}}
                                    style={styles.imgMyProduct}
                                  />
                                  <Text
                                    numberOfLines={1}
                                    style={styles.textDataProduk}>
                                    {value.name}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                  {this.state.user.role != null ? (
                    <View style={styles.viewButton}>
                      <TouchableOpacity
                        style={styles.touchToko}
                        onPress={() =>
                          this.props.navigation.replace('PesananPenjual')
                        }>
                        <Text style={styles.text}>Pesanan</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.touchToko}
                        onPress={() =>
                          this.props.navigation.replace('AddProduct')
                        }>
                        <Text style={styles.text}>Tambah Produk</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{marginTop: 20}}></View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4EC5F1',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBG: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    width: '95%',
  },
  viewMainProfile: {
    alignItems: 'center',
  },
  viewData: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewData2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  iconProfile: {
    width: 20,
    height: 20,
    marginRight: 10,
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
  viewTextProfile: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    width: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
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
    marginVertical: 5,
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
    backgroundColor: '#ffffff',
    width: '100%',
    height: 135,
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
  },
  viewDataProduk: {
    backgroundColor: '#00000026',
    marginRight: 5,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 105,
  },
  subViewDataProduk: {
    flexDirection: 'row',
  },
  textDataProduk: {
    textAlign: 'center',
  },
  viewLottie: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
  },
  viewMyProduct: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  imgMyProduct: {
    width: 85,
    height: 85,
    borderRadius: 5,
    alignSelf: 'center',
  },
  viewButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  openStore: {
    backgroundColor: '#4EC5F1',
    height: 55,
    borderRadius: 5,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  textOpenStore: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 15,
  },
});

export default Profile;
