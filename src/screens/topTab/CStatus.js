import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import React, {Component} from 'react';
import LottieView from 'lottie-react-native';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';

export default class CStatus extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      data: [],
      responseJson: [],
      image: '',
      photo: '',
      amount: '',
      name: '',
      transfer_to: '',
      loading: false,
      refresh: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token !== null) {
          this.setState({token: token});
          this.getPayment();
        } else {
          console.log('Tidak ada token.');
        }
      })
      .catch((err) => console.log(err));
  }

  getPayment() {
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/payment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        // console.log(responseJson);
        if (responseJson.data != null || '') {
          this.setState({
            loading: false,
            data: responseJson.data,
          });
          console.log(this.state.data);
        } else {
          this.setState({loading: false});
          console.log(this.state.data);
        }
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log(err);
      });
  }

  payment() {
    const {photo, amount, name, transfer_to} = this.state;
    if (photo.name === undefined) {
      const body = {
        amount: amount,
        name: name,
        transfer_to: transfer_to,
      };
      this.setState({loading: true});
      fetch(`http://si--amanah.herokuapp.com/api/payment`, {
        method: 'POST',
        body: this.createFormData(photo, body),
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response.status == 'Success') {
            console.log('upload succes', response);
            alert('Pesanan telah dibayar. Menunggu konfirmasi penjual.');
            this.props.navigation.replace('BottomTab', {screen: 'Transaction'});
          } else {
            alert('Error');
            this.setState({loading: false});
          }
        })
        .catch((error) => {
          this.setState({loading: false});
          alert('Terjadi kesalahan. ' + error);
        });
    } else {
      alert('Gambar harus ada.');
    }
  }

  payment2() {
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/payment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        console.log(responseJson);
        if (responseJson.data) {
          this.setState({
            loading: false,
            data: responseJson.data,
          });
          console.log(this.state.data);
        } else {
          this.setState({loading: false});
          console.log(this.state.data);
        }
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log(err);
      });
  }

  createFormData = (photo, body) => {
    const data = new FormData();
    data.append('bukti', {
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
  };

  handleEditPhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({photo: response});
        console.log(JSON.stringify(response));
      }
    });
  };

  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
        <ScrollView>
          {this.state.data == '' ? (
            <View style={styles.viewLoading}>
              <LottieView
                source={require('../../assets/8205-loading-animation.json')}
                autoPlay={true}
                style={{height: 120}}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.urOrder}>Pesanan anda:</Text>
              <View style={{marginRight: 10}}>
                {/* {this.state.data.map((value, index) => (
                  <ScrollView key={index} horizontal={true}>
                    <View>
                      <View style={styles.viewItem}>
                        <Image
                          source={{uri: value.product.image}}
                          style={{width: 100, height: 100}}
                        />
                        <Text>{value.product.name}</Text>
                      </View>
                    </View>
                  </ScrollView>
                ))} */}
              </View>
              <Text>Kirim bukti pembayaran.</Text>
              <TouchableOpacity
                style={styles.viewPP}
                onPress={() => this.handleEditPhoto()}>
                {this.state.photo !== '' ? (
                  <Image
                    source={{uri: this.state.photo.uri}}
                    style={styles.pp}
                  />
                ) : (
                  <View style={styles.pp}>
                    <Text style={styles.textPlus}>+</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text>Konfirmasi nominal yang anda kirim:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="nominal"
                onChangeText={(input) => this.setState({amount: input})}
              />
              <Text>Konfirmasi nama Anda:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="nama"
                onChangeText={(input) => this.setState({name: input})}
              />
              <Text>Konfirmasi nama penerima:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="nama penerima"
                onChangeText={(input) => this.setState({transfer_to: input})}
              />
              <Button
                title="Kirim bukti pembayaran"
                onPress={() => this.payment()}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    justifyContent: 'center',
  },
  textPlus: {
    alignSelf: 'center',
    fontSize: 50,
  },
  viewProduct: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
  },
  subViewProduct: {
    backgroundColor: 'aqua',
    borderRadius: 5,
    padding: 10,
  },
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '100%',
  },
  urOrder: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 20,
  },
  viewItem: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    elevation: 1,
    marginBottom: 5,
  },

  textInput: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
    marginTop: 5,
  },
});
