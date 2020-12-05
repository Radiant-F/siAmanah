import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import _ from 'lodash';
import React, {Component} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';

class DetailOrder extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      data: [],
      loading: false,
      idSend: '',
      image: '',
      status: '',
    };
  }

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((value) => {
      if (value != null) {
        this.setState({token: value});
        console.log('Token tersedia.');
        this.confirmedPayment();
      } else {
        console.log('Token hilang.');
      }
    });
  }

  confirmedPayment() {
    console.log(
      'mengambil detail dari ID ' + this.props.route.params.id + '..',
    );
    this.setState({loading: true});
    fetch(
      `https://si--amanah.herokuapp.com/api/history/${this.props.route.params.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        if (responseJson.data[0].status != null) {
          this.setState({
            loading: false,
            data: responseJson.data,
          });
          console.log(this.state.data);
        } else {
          this.setState({loading: false});
          this.alert();
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({loading: false});
      });
  }

  confirmProduct(id) {
    console.log('Mengkonfirmasi...');
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/accept/${id}`, {
      method: 'POST',
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
          this.setState({loading: false});
          this.alert2();
          this.confirmedPayment();
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
      'Sabar cuy',
      'Harap tunggu konfirmasi penjual.',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
        },
      ],
      {cancelable: false},
    );
  }

  alert2() {
    Alert.alert(
      'Mantap!',
      'Pesanan telah sampai ke tangan anda.',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
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
            source={require('../../assets/headerTransaction.png')}
            style={styles.headerBg}>
            <Image
              source={require('../../assets/transaksi.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerText}>Detail Pesanan</Text>
          </ImageBackground>
        </View>
        <ScrollView>
          {this.state.data == '' ? (
            <View style={styles.viewLoading}>
              <LottieView
                autoPlay
                style={{width: 120}}
                source={require('../../assets/8205-loading-animation.json')}
              />
            </View>
          ) : (
            <View style={{padding: 5}}>
              {this.state.data.map((value, index) => (
                <View key={index} style={styles.viewMain}>
                  <Image
                    source={{uri: value.product.image}}
                    style={styles.image}
                  />
                  <View style={styles.viewText}>
                    <Text style={styles.name}>{value.product.name}</Text>
                    <View style={styles.subText}>
                      <Text>Jumlah pesanan anda: {value.jumlah}</Text>
                      <Text>
                        Total harga:{' '}
                        <Text style={{color: 'green', fontWeight: 'bold'}}>
                          Rp.{this.toPrice(value.jumlah_harga)},-
                        </Text>
                      </Text>
                    </View>
                  </View>
                  {value.status == 2 ? (
                    <View style={styles.button}>
                      <Button
                        title="Konfirmasi pesanan"
                        onPress={() => this.confirmProduct(value.id)}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: '#00cc1f',
                        paddingVertical: 9,
                        elevation: 3,
                        borderRadius: 1,
                        marginVertical: 5,
                      }}>
                      <Text style={{textAlign: 'center', color: 'white'}}>
                        Pesanan sudah Anda terima!
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '95%',
    marginTop: 10,
    padding: 5,
  },
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
    height: 25,
    tintColor: 'white',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 5,
    paddingBottom: 5,
  },
  viewMain: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  viewText: {
    marginVertical: 5,
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  name: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  subText: {
    marginTop: 5,
  },
  button: {
    marginVertical: 10,
  },
});

export default DetailOrder;
