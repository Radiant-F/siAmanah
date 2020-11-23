import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';

export default class PesananPenjual extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      dataSource: [],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        console.log('token tersedia.');
        this.setState({token: token});
        this.getOrder();
      } else {
        console.log('Tidak ada token. User harus login.');
      }
    });
  }

  getOrder() {
    console.log('sedang mengambil pesanan..');
    fetch('http://si--amanah.herokuapp.com/api/gasorder/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({dataSource: responseJson.data});
        console.log(this.state.dataSource);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  confirmOrder() {}

  abortOrder() {}

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/headerTransaction.png')}
            style={styles.headerBg}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.replace('BottomTab', {screen: 'Profile'})
              }>
              <Image
                source={require('../assets/go-back-left-arrow.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Pesanan</Text>
          </ImageBackground>
        </View>
        <ScrollView>
          {/* {this.state.cart.map((value, index) => ( */}
          <View
          // key={index}
          >
            <View style={styles.viewOrder}>
              <Image
                // source={{uri: value.product.image}}
                style={styles.imageOrder}
              />
              <View
                style={{
                  flex: 1,
                  borderLeftColor: 'black',
                  borderLeftWidth: 1,
                  paddingLeft: 10,
                }}>
                <Text numberOfLines={1} style={styles.textProduct}>
                  {/* {value.product.name} */}
                </Text>
                <Text>Jumlah harga :</Text>
                <Text style={styles.textPrice}>
                  {/* Rp.{value.jumlah_harga},- */}
                </Text>
                <Text>{/* Jumlah pesanan: {value.jumlah} */}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteOrder}
                // key={index}
                onPress={() => this.abortOrder(value.id)}>
                {/* <Image
                  source={require('../assets/rubbish-bin-delete-button.png')}
                  style={styles.bin}
                /> */}
                <Text style={{textAlign: 'center', color: 'red'}}>Tolak</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginVertical: 5,
              }}>
              <Button
                title="Lihat bukti pembayaran"
                onPress={() => this.props.navigation.navigate('Nota')}
              />
              <Button title="Konfirmasi" onPress={() => this.confirmOrder()} />
            </View>
          </View>
          {/* ))} */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4EC5F1',
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
  },
  headerIcon: {
    width: 25,
    height: 27,
    tintColor: 'white',
  },
  viewOrder: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
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
  },
  textPrice: {
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bin: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    tintColor: 'red',
  },
});
