import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import _ from 'lodash';
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

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
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
    console.log(
      'Mengambil order id ke ' + this.props.route.params.data.order_id + '..',
    );
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
          console.log('Error');
        }
        this.setState({refresh: false});
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
        this.setState({loading: false});
        this.setState({refresh: false});
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
              {this.state.nota.bukti != '' ? (
                <Image
                  source={{uri: this.state.nota.bukti}}
                  style={styles.image}
                />
              ) : (
                <View>
                  <Text>Mengambil nota..</Text>
                </View>
              )}
              <View style={styles.text}>
                <Text>
                  {' '}
                  Jumlah Nominal:
                  <Text style={{fontWeight: 'bold', color: 'green'}}>
                    {' '}
                    Rp.{this.toPrice(this.state.nota.amount)},-
                  </Text>
                </Text>
                <Text>
                  {' '}
                  Nama pembeli:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {this.state.nota.name}
                  </Text>
                </Text>
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
    elevation: 2,
    width: '100%',
  },
  image: {
    width: 250,
    height: 250,
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
