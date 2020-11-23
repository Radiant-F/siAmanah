import AsyncStorage from '@react-native-community/async-storage';
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
    fetch(`https://si--amanah.herokuapp.com/api/payment/3`, {
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
        if (responseJson != null || '') {
          this.setState({
            loading: false,
            nota: responseJson.data,
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
        <ScrollView>
          <Text> Bukti gambar: {this.state.nota.bukti} </Text>
          <Text> Jumlah nominal: {this.state.nota.amount}</Text>
          <Text> Nama pembeli: {this.state.nota.name} </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4EC5F1',
    // height: 60,
    // alignItems: 'center',
    // paddingHorizontal: 20,
    // flexDirection: 'row',
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
});

export default Nota;
