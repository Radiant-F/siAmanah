import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ShadowPropTypesIOS,
  TouchableOpacity,
  Button,
} from 'react-native';

class Nota extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      nota: [],
      loading: false,
      tujuan: '',
      refresh: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token !== null) {
          this.setState({token: token});
          console.log(this.state.token);
          this.getNota();
        } else {
          console.log('Tidak ada token.');
        }
      })
      .catch((err) => console.log(err));
  }

  getNota() {
    this.setState({loading: true});
    fetch(
      `https://si--amanah.herokuapp.com/api/payment/${this.props.route.params.data.order_id}`,
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
        if (responseJson != null || '') {
          this.setState({
            loading: false,
            nota: responseJson.data[0],
          });
          console.log(this.state.nota);
        } else {
          this.setState({loading: false});
          console.log(this.state.nota);
        }
        this.setState({refresh: false});
      })
      .catch((err) => {
        console.log(err);
        this.setState({loading: false});
        this.setState({refresh: false});
      });
  }

  confirm() {
    this.setState({loading: true});
    fetch(
      `http://si--amanah.herokuapp.com/api/send/${this.props.route.params.data.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON.status == 'Success') {
          console.log(responseJSON);
          this.setState({loading: false});
          alert(
            'Pesanan telah anda konfirmasi. Barang akan dikirim kepada pembeli.',
          );
          this.props.navigation.replace('BottomTab', {screen: 'Profil'});
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
            source={require('../assets/headerTransaction.png')}
            style={styles.headerBg}>
            <Image
              source={require('../assets/transaksi.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerText}>Nota Pembeli</Text>
          </ImageBackground>
        </View>
        {this.state.nota == '' ? (
          <View style={styles.viewLoading}>
            <LottieView
              autoPlay
              style={{width: 120}}
              source={require('../assets/8205-loading-animation.json')}
            />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.viewNota}>
              <Image
                source={{uri: this.state.nota.bukti}}
                style={styles.image}
              />
              <View style={styles.text}>
                <Text>
                  {' '}
                  Jumlah Nominal:
                  <Text style={{fontWeight: 'bold'}}>
                    {' '}
                    Rp.{this.state.nota.amount},-
                  </Text>
                </Text>
                <Text> Nama pembeli: {this.state.nota.name} </Text>
                <Text> Dikirim ke: {this.state.nota.transfer_to} </Text>
              </View>
              <View style={styles.button}>
                <Button title="Konfirmasi" onPress={() => this.confirm()} />
              </View>
            </View>
          </ScrollView>
        )}
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
    height: 25,
    tintColor: 'white',
  },
  imgPp: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  viewChat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingVertical: 10,
  },
  viewTextChat: {
    flex: 1,
    height: 60,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  textName: {
    fontSize: 20,
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
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    margin: 10,
    borderRadius: 5,
  },
  viewNota: {
    margin: 5,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    marginBottom: 10,
  },
  button: {
    margin: 10,
  },
  text: {
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default Nota;
