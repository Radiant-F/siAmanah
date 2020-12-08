import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import {
  Button,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default class editShop extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      loading: false,
      name: '',
      description: '',
      alamat: '',
      photo: '',
      shop: '',
      earning: '',
      image: '',
    };
  }

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
  }

  componentDidMount() {
    AsyncStorage.getItem('token')
      .then((token) => {
        JSON.stringify(token);
        if (token !== null) {
          this.setState({token: token});
          console.log(this.state.token);
          this.getToko();
        } else {
          alert('Token hilang!');
        }
      })
      .catch((err) => console.log(err));
  }

  getToko() {
    console.log('sedang mengambil toko..');
    fetch('https://si--amanah.herokuapp.com/api/myshop', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          shop: responseJson.data.shop[0],
          earning: responseJson.data.Order_details,
          name: responseJson.data.shop[0].name,
          description: responseJson.data.shop[0].description,
          alamat: responseJson.data.shop[0].alamat,
          image: responseJson.data.shop[0].image,
        });
        console.log(this.state.shop);
        console.log('total pemasukan toko: ', this.state.earning);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  editToko() {
    const {name, description, alamat, photo} = this.state;
    if (name && description && alamat && photo !== '') {
      const product = {
        _method: 'PUT',
        name: name,
        description: description,
        alamat: alamat,
      };
      this.setState({loading: true});
      fetch(`https://si--amanah.herokuapp.com/api/shop/${this.state.shop.id}`, {
        method: 'POST',
        body: this.createFormData(photo, product),
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          console.log(responseJSON);
          if (responseJSON.status != 'Error') {
            this.setState({loading: false, shop: ''});
            ToastAndroid.show('Toko telah disunting', ToastAndroid.SHORT);
            this.getToko();
          }
        })
        .catch((error) => {
          console.log('Upload error', error);
          this.failed();
          this.setState({loading: false});
        });
    } else {
      this.unfin();
      this.setState({loading: false});
    }
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({photo: response});
        console.log(this.state.photo);
      }
    });
  };

  failed() {
    Alert.alert(
      'Terjadi Kesalahan',
      'Periksa kode Anda.',
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
  }

  unfin() {
    Alert.alert(
      'Perhatian',
      'Harap ubah foto.',
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
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

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.shop == '' ? (
          <View style={styles.viewLoading}>
            <LottieView
              source={require('../../assets/8205-loading-animation.json')}
              autoPlay={true}
              style={{height: 120}}
            />
          </View>
        ) : (
          <View>
            <ScrollView>
              <View style={styles.earning}>
                <Text> Total Jumlah Pemasukan Anda: </Text>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  {' '}
                  Rp.
                  <Text style={styles.money}>
                    {this.toPrice(this.state.earning)}
                  </Text>
                  ,-{' '}
                </Text>
              </View>
              <View style={styles.input}>
                <TextInput
                  value={this.state.name}
                  style={styles.textInput}
                  placeholder="Nama Toko"
                  onChangeText={(input) => this.setState({name: input})}
                />
              </View>
              <TouchableOpacity
                style={styles.viewPP}
                onPress={() => this.handleChoosePhoto()}>
                {this.state.photo !== '' ? (
                  <Image
                    source={{uri: this.state.photo.uri}}
                    style={styles.pp}
                  />
                ) : (
                  <Image source={{uri: this.state.image}} style={styles.pp} />
                )}
              </TouchableOpacity>
              <View style={styles.input}>
                <TextInput
                  value={this.state.description}
                  style={styles.textInput}
                  placeholder="Deskripsi"
                  onChangeText={(input) => this.setState({description: input})}
                />
                <TextInput
                  value={this.state.alamat}
                  style={styles.textInput}
                  placeholder="Alamat Toko"
                  onChangeText={(input) => this.setState({alamat: input})}
                />
              </View>
              <View style={styles.viewOption}>
                <TouchableOpacity
                  style={styles.touchOption}
                  onPress={() =>
                    this.props.navigation.replace('BottomTab', {
                      screen: 'Profile',
                    })
                  }>
                  <Text style={styles.text}>Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchOption1}
                  onPress={() => this.editToko()}>
                  {this.state.loading ? (
                    <TouchableOpacity style={styles.touchLoading}>
                      <ActivityIndicator color="blue" size="small" />
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.text}>Edit Toko</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
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
  viewPP: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 1,
    margin: 5,
    padding: 5,
  },
  pp: {
    width: 120,
    height: 120,
    borderColor: '#4EC5F1',
    borderWidth: 2,
  },
  ppnt: {
    width: 120,
    height: 120,
    borderColor: '#ffaa00',
    borderWidth: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  textUploadPp: {
    textAlign: 'center',
  },
  input: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 1,
    margin: 5,
    padding: 5,
    paddingHorizontal: 20,
  },
  earning: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 1,
    margin: 5,
    padding: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  money: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'green',
  },
  touchOption: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffaa00',
    borderRadius: 10,
    width: 150,
    elevation: 2,
  },
  touchOption1: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48e5e5',
    borderRadius: 10,
    width: 150,
    elevation: 2,
  },
  touchLoading: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 5,
    width: 150,
  },
  viewOption: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
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
  textInput: {},
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '95%',
    margin: 10,
    elevation: 2,
  },
});
