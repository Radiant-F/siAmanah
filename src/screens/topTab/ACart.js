import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
  ToastAndroid,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      cart: [],
      loading: false,
      tujuan: '',
      refresh: false,
    };
  }

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
  }

  componentDidMount() {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token !== null) {
          this.setState({token: token});
          console.log(this.state.token);
          this.getItem();
        } else {
          console.log('Tidak ada token.');
        }
      })
      .catch((err) => console.log(err));
  }

  getItem() {
    console.log('mengambil keranjang..');
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/check-out`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        if (responseJson.data != null || '') {
          this.setState({
            loading: false,
            cart: responseJson.data,
          });
          console.log('Keranjang: ' + this.state.cart);
        } else {
          this.setState({loading: false});
          console.log('Keranjang: ' + this.state.cart);
        }
        this.setState({refresh: false});
      })
      .catch((err) => {
        this.setState({loading: false});
        this.setState({refresh: false});
        console.log('Keranjang: ' + err);
      });
  }

  deleteProduct(id) {
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/check-out/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        const {status} = json;
        if (status == 'Success') {
          ToastAndroid.show('Barang telah dihapus', ToastAndroid.SHORT);
          this.setState({loading: false});
          this.getItem();
        } else {
          this.setState({loading: false});
          alert('Gagal menghapus');
        }
      })
      .catch((err) => console.log(err), this.setState({loading: false}));
  }

  checkOut() {
    const {tujuan} = this.state;
    if (tujuan !== '') {
      const body = {
        tujuan: tujuan,
      };
      this.setState({loading: true});
      fetch('https://si--amanah.herokuapp.com/api/konfirmasi-check-out', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status == 'Success') this.setState({loading: false});
          console.log(response);
          this.alert();
          this.props.navigation.replace('BottomTab', {screen: 'Transaction'});
        })
        .catch((error) => {
          this.setState({loading: false});
          alert('Terjadi kesalahan. ', error);
        });
    } else {
      this.setState({loading: false});
      ToastAndroid.show(
        'Harap isi alamat tujuan.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  }

  alert() {
    Alert.alert(
      'Sukses!',
      'Pesanan Anda telah dibuat. Harap kirim bukti pembayaran.',
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View>
        {this.state.cart == '' ? (
          <View style={style.viewLoading}>
            <LottieView
              source={require('../../assets/17990-empty-cart.json')}
              autoPlay={true}
              style={{height: 120}}
            />
          </View>
        ) : (
          <View>
            <ScrollView>
              <View style={style.viewAdress}>
                <Text>Masukan alamat tujuan: </Text>
                <TextInput
                  onChangeText={(input) => this.setState({tujuan: input})}
                  style={style.inputAdress}
                  placeholder="Alamat tujuan"
                />
              </View>
              {this.state.cart.map((value, index) => (
                <View key={index}>
                  <View style={style.viewOrder}>
                    <Image
                      source={{uri: value.product.image}}
                      style={style.imageOrder}
                    />
                    <View
                      style={{
                        flex: 1,
                        borderLeftColor: 'black',
                        borderLeftWidth: 1,
                        paddingLeft: 10,
                      }}>
                      <Text numberOfLines={1} style={style.textProduct}>
                        {value.product.name}
                      </Text>
                      <Text>Jumlah harga :</Text>
                      <Text style={style.textPrice}>
                        Rp.{this.toPrice(value.jumlah_harga)},-
                      </Text>
                      <Text>Jumlah pesanan: {value.jumlah}</Text>
                    </View>
                    <TouchableOpacity
                      style={style.deleteOrder}
                      key={index}
                      onPress={() => this.deleteProduct(value.id)}>
                      <Image
                        source={require('../../assets/rubbish-bin-delete-button.png')}
                        style={style.bin}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={style.confirm}
                onPress={() => this.checkOut()}>
                <Text style={style.textCheck}>Checkout!</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const style = StyleSheet.create({
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '95%',
    margin: 10,
  },
  viewAdress: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    elevation: 1,
    padding: 10,
  },
  inputAdress: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  viewOrder: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 5,
  },
  imageOrder: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  deleteOrder: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderLeftColor: 'black',
    borderLeftWidth: 1,
  },
  textProduct: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingRight: 10,
  },
  textPrice: {
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
  },
  confirm: {
    backgroundColor: '#5cf4ff',
    width: 200,
    height: 55,
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    margin: 5,
    elevation: 3,
  },
  textCheck: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  bin: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    tintColor: 'red',
  },
});

export default Cart;
