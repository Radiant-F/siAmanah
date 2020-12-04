import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import React, {Component} from 'react';
import _ from 'lodash';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  ScrollViewComponent,
  TextInput,
  ToastAndroid,
  Alert,
} from 'react-native';

export class DetailProduct extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      dataSource: [],
      loading: false,
      qty: 0,
      idProduk: '',
      idSeller: '',
    };
  }

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        this.setState({
          token: token,
          idProduk: this.props.route.params.item.id,
          idSeller: this.props.route.params.item.user.id,
        });
        console.log('id produk: ' + this.state.idProduk);
        console.log('id penjual: ' + this.state.idSeller);
        console.log(this.props.route.params);
      } else {
        console.log('Token hilang! Harap login untuk beli barang.');
      }
    });
  }

  plus() {
    this.setState({qty: this.state.qty + 1});
  }
  minus() {
    if (this.state.qty <= 0) {
      this.setState({qty: this.state.qty});
    } else {
      this.setState({qty: this.state.qty - 1});
    }
  }

  addCart() {
    if (this.state.qty != 0) {
      const {qty} = this.state;
      const kirimData = {jumlah_pesan: qty};
      this.setState({loading: true});
      fetch(
        `http://si--amanah.herokuapp.com/api/order/${this.state.idProduk}`,
        {
          method: 'POST',
          body: JSON.stringify(kirimData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((responseJSON) => {
          const {status} = responseJSON;
          if (status != 'error') {
            console.log(responseJSON);
            this.setState({loading: false});
            ToastAndroid.show(
              'Barang telah masuk ke keranjang.',
              ToastAndroid.SHORT,
            );
          } else {
            this.setState({loading: false});
            alert('Harap perhatikan stok.');
          }
        })
        .catch((err) => {
          this.setState({loading: false});
          alert('Terjadi kesalahan. ' + err);
        });
    } else {
      alert('Mau beli berapa banyak?');
    }
  }

  addCartInstant() {
    if (this.state.qty != 0) {
      const {qty} = this.state;
      const kirimData = {jumlah_pesan: qty};
      this.setState({loading: true});
      fetch(
        `http://si--amanah.herokuapp.com/api/order/${this.state.idProduk}`,
        {
          method: 'POST',
          body: JSON.stringify(kirimData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((responseJSON) => {
          const {status} = responseJSON;
          if (status != 'error') {
            console.log(responseJSON);
            this.setState({loading: false});
            this.props.navigation.replace('BottomTab', {screen: 'Transaction'});
          } else {
            this.setState({loading: false});
            alert('Harap perhatikan stok.');
          }
        })
        .catch((err) => {
          this.setState({loading: false});
          alert('Terjadi kesalahan. ' + err);
        });
    } else {
      alert('Mau beli berapa banyak?');
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => this.props.navigation.replace('BottomTab')}>
            <Image
              source={require('../assets/go-back-left-arrow.png')}
              style={styles.headerIconBack}
            />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerText}>
            {this.props.route.params.item.name}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.replace('BottomTab', {
                screen: 'Transaction',
              })
            }>
            <Image
              source={require('../assets/shopping-cart.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Image
            source={{uri: this.props.route.params.item.image}}
            style={styles.image}
          />
          <View style={styles.items}>
            <View style={styles.viewTextProduct}>
              <Text style={styles.textProduct}>
                {this.props.route.params.item.name}
              </Text>
              <Text style={styles.textPrice}>
                Rp.{this.toPrice(this.props.route.params.item.price)},-
              </Text>
              <View style={styles.viewQty}>
                <Text style={{fontSize: 17}}>
                  Stok barang: {this.props.route.params.item.stock}
                </Text>
                <View style={styles.viewQtys}>
                  <TouchableOpacity
                    onPress={() => this.minus()}
                    style={styles.touchQtyMinus}>
                    <Text style={styles.textQtyMinus}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.textQtyMain}>{this.state.qty}</Text>
                  <TouchableOpacity
                    onPress={() => this.plus()}
                    style={styles.touchQtyPlus}>
                    <Text style={styles.textQtyPlus}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.viewPurchase}>
                <TouchableOpacity
                  style={styles.chatSeller}
                  onPress={() =>
                    this.props.navigation.navigate('ChatScreen', {
                      seller: this.props.route.params.item,
                    })
                  }>
                  <Text style={styles.textChatSeller}>Chat Penjual</Text>
                </TouchableOpacity>
                {this.state.loading ? (
                  <LottieView
                    source={require('../assets/36605-shopping-cart.json')}
                    autoPlay={true}
                    style={{width: 40, height: 40}}
                  />
                ) : (
                  <TouchableOpacity onPress={() => this.addCart()}>
                    <Image
                      source={require('../assets/cartPurchase.png')}
                      style={styles.cartImage}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.purchaseNow}
                  onPress={() => this.addCartInstant()}>
                  <Text style={styles.textPurchase}>Beli Sekarang!</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.viewDesc}>
                <Text style={styles.textDescPro}>Deskripsi Barang:</Text>
                <Text style={styles.textDesc}>
                  {this.props.route.params.item.description}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
    flex: 1,
  },
  headerView: {
    backgroundColor: '#50c6f1',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  headerIcon: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  headerIconBack: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  items: {
    marginTop: -30,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 2,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 355,
  },
  viewPurchase: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  cartImage: {
    width: 40,
    height: 42,
    tintColor: '#22a800',
  },
  viewTextProduct: {
    alignSelf: 'flex-start',
  },
  textProduct: {
    // marginVertical: 5,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    // borderTopColor: 'black',
    // borderTopWidth: 1,
    paddingBottom: 10,
  },
  viewQty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputQty: {
    height: 40,
    borderBottomWidth: 'black',
    // borderLeftColor: 'black',
    borderBottomWidth: 1,
  },
  textPrice: {
    color: '#22a800',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textDesc: {
    marginTop: 10,
  },
  viewDesc: {
    borderTopWidth: 1,
    borderTopColor: 'black',
    padding: 10,
    // backgroundColor: 'aqua',
    marginTop: 10,
  },
  textDescPro: {
    fontWeight: 'bold',
    fontSize: 17,
    // textShadowColor: '#f5a300',
    // textShadowRadius: 1,
  },
  chatSeller: {
    width: '35%',
    height: 45,
    backgroundColor: '#62d0f8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChatSeller: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  purchaseNow: {
    width: '35%',
    height: 45,
    backgroundColor: '#f5a300',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // textPurchase: {
  //   fontWeight: 'bold',
  //   fontSize: 17,
  //   color: 'white',
  // },
  viewTextPurchase: {
    width: 170,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    marginTop: 10,
    borderRadius: 10,
  },
  textPurchase: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  touchQtyPlus: {
    borderLeftColor: 'black',
    borderLeftWidth: 1,
    width: 25,
  },
  touchQtyMinus: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    width: 25,
  },
  textQtyPlus: {
    fontSize: 20,
    textAlign: 'center',
  },
  textQtyMinus: {
    fontSize: 20,

    textAlign: 'center',
  },
  textQtyMain: {
    paddingHorizontal: 5,
    fontSize: 20,
  },
  viewQtys: {
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    // justifyContent: 'space-evenly',
  },
});

export default DetailProduct;
