import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import React, {Component} from 'react';
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
    console.log('Mengambil histori..');
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
          console.log('History:');
          console.log(this.state.dataHistory);
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
        {this.state.dataHistory == '' ? (
          <View style={styles.viewLoading}>
            <LottieView
              autoPlay
              style={{width: 120}}
              source={require('../../assets/8205-loading-animation.json')}
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
                      Rp.{value.jumlah_harga},-
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
