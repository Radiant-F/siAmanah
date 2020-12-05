import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import _ from 'lodash';
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
  Alert,
} from 'react-native';

export default class PesananPenjual extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      dataSource: [],
      idConfirm: '',
      loading: false,
      status: '',
    };
  }

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
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
    fetch('https://si--amanah.herokuapp.com/api/gasorder', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let semuaData = responseJson.data;
        semuaData.sort((a, b) => b.id - a.id);
        this.setState({
          dataSource: semuaData,
          idConfirm: responseJson.data[0].id,
          status: responseJson.data[0].status,
        });
        console.log('ID untuk konfirmasi pesanan: ' + this.state.idConfirm);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  confirmOrder(id) {
    this.setState({loading: true, dataSource: ''});
    fetch(`https://si--amanah.herokuapp.com/api/send/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON.status == 'Success') {
          console.log(responseJSON);
          this.alert();
          this.getOrder();
          this.setState({loading: false});
        } else {
          this.setState({loading: false});
          alert('Gagal dikonfirmasi.');
        }
      })
      .catch((err) => {
        this.setState({loading: false});
        alert('Terjadi kesalahan. ' + err);
      });
  }

  alert() {
    Alert.alert(
      'Sukses',
      'Pesanan telah anda konfirmasi. Barang akan dikirim kepada pembeli.',
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
          <View style={{padding: 10}}>
            {this.state.dataSource == '' ? (
              <View style={styles.viewLoading}>
                <LottieView
                  autoPlay
                  style={{width: 120}}
                  source={require('../assets/8205-loading-animation.json')}
                />
              </View>
            ) : (
              <View>
                {this.state.dataSource.map((value, index) => (
                  <View key={index}>
                    <View style={styles.viewPesanan}>
                      <Image
                        source={{uri: value.product.image}}
                        style={styles.image}
                      />
                      <View style={styles.viewText}>
                        <Text style={styles.name}>{value.product.name}</Text>
                        <Text>Jumlah pesanan: {value.jumlah}</Text>
                        <Text>
                          Jumlah harga:{' '}
                          <Text style={{color: 'green', fontWeight: 'bold'}}>
                            Rp.{this.toPrice(value.jumlah_harga)},-
                          </Text>
                        </Text>
                        {value.status != 2 ? (
                          <View>
                            <Text>
                              Status:{' '}
                              <Text style={{color: 'tomato'}}>
                                belum dikonfirmasi.
                              </Text>{' '}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <Text>
                              Status:{' '}
                              <Text style={{color: 'green'}}>
                                dikonfirmasi.
                              </Text>
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.viewButton}>
                      <Button
                        color="orange"
                        title="Lihat bukti pembayaran"
                        onPress={() =>
                          this.props.navigation.navigate('Nota', {
                            data: value,
                          })
                        }
                      />
                      {value.status != 2 ? (
                        <Button
                          title="Konfirmasi"
                          onPress={() => this.confirmOrder(value.id)}
                        />
                      ) : (
                        <View style={styles.viewConfirmed}>
                          <Text style={{color: 'white'}}>Dikonfirmasi</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
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
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '100%',
    elevation: 2,
    marginBottom: 10,
  },
  viewButton: {
    marginBottom: 25,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  viewPesanan: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 5,
    borderRadius: 5,
  },
  viewText: {
    marginLeft: 5,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  viewConfirmed: {
    backgroundColor: 'grey',
    paddingHorizontal: 10,
    borderRadius: 2,
    elevation: 2,
    justifyContent: 'center',
  },
});
