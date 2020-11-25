import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import React, {Component} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
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

  componentDidMount() {
    AsyncStorage.getItem('token').then((value) => {
      if (value != null) {
        this.setState({token: value});
        console.log('Token tersedia.');
        this.confirmPayment();
      } else {
        console.log('Token hilang.');
      }
    });
  }

  confirmPayment() {
    console.log('Mengambil detail...');
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
        console.log(responseJson);
        if (responseJson.data[0].status != null) {
          this.setState({
            loading: false,
            data: responseJson.data,
            idSend: responseJson.data[0].id,
            image: responseJson.data[0].product.image,
            status: responseJson.data[0].status,
          });
          console.log(this.state.status);
          console.log('ID untuk menerima pesanan: ' + this.state.idSend);
        } else {
          this.setState({loading: false});
          alert('Harap tunggu konfirmasi penjual.');
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({loading: false});
      });
  }

  confirmProduct() {
    this.setState({loading: true});
    fetch(`http://si--amanah.herokuapp.com/api/accept/${this.state.idSend}`, {
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
          alert('Pesanan telah sampai ke tangan anda.');
          this.props.navigation.replace('BottomTab');
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
                <Image source={{uri: this.state.image}} style={styles.image} />
                <View style={styles.viewText}>
                  <Text style={styles.name}>{value.product.name}</Text>
                  <View style={styles.subText}>
                    <Text>Jumlah pesanan anda: {value.jumlah}</Text>
                    <Text>Total harga: Rp.{value.jumlah_harga},-</Text>
                  </View>
                </View>
                {this.state.status == '2' ? (
                  <View style={styles.button}>
                    <Button
                      title="Konfirmasi pesanan"
                      onPress={() => this.confirmProduct()}
                    />
                  </View>
                ) : (
                  <View>
                    <Text>Pesanan sudah Anda terima.</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
    width: '100%',
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
