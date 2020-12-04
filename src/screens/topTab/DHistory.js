import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import React, {Component} from 'react';
import _ from 'lodash';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';

class History extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      dataHistory: [],
      loading: false,
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
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        if (responseJson.data != '') {
          this.setState({
            loading: false,
            dataHistory: responseJson.data,
          });
          console.log('Status: ', this.state.dataHistory);
        } else {
          this.setState({loading: false});
          console.log('History:');
          console.log(this.state.dataHistory);
        }
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log(err);
      });
  }

  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
        <ScrollView>
          {this.state.dataHistory == '' ? (
            <View style={styles.viewLoading}>
              <LottieView
                autoPlay
                style={{width: 160}}
                source={require('../../assets/17990-empty-cart.json')}
              />
            </View>
          ) : (
            <View>
              <Text>Histori pesanan Anda:</Text>
              {this.state.dataHistory.map((value, index) => (
                <View key={index} style={{marginVertical: 10}}>
                  <View style={styles.viewHistory}>
                    <Text>
                      Jumlah Harga:
                      <Text style={{fontWeight: 'bold'}}>
                        {' '}
                        Rp.{this.toPrice(value.jumlah_harga)},-
                      </Text>
                    </Text>
                    <Text>
                      Tujuan:
                      <Text style={{fontWeight: 'bold'}}> {value.tujuan}</Text>
                    </Text>
                    <Text>
                      Tanggal pemesanan:
                      <Text style={{fontWeight: 'bold'}}> {value.tanggal}</Text>
                    </Text>
                  </View>
                  <Button
                    title="Lihat detail pemesanan"
                    onPress={() =>
                      this.props.navigation.navigate('OrderDetail', {
                        id: value.id,
                      })
                    }
                  />
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
    width: '100%',
  },
  viewHistory: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 5,
  },
});

export default History;
