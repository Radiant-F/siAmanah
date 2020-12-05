import React, {Component} from 'react';
import LottieView from 'lottie-react-native';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

class ScreenElectronics extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      data: [],
      loading: true,
    };
  }

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((value) => {
      if (value != null) {
        console.log('token ada');
        this.setState({token: value});
        this.getProduct();
      }
    });
  }

  getProduct() {
    console.log('sedang mengambil produk..');
    fetch('https://si--amanah.herokuapp.com/api/kategori/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({data: responseJson.data});
        console.log(this.state.data);
      })
      .catch((err) => {
        alert('Terjadi kesalahan. ' + err);
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.replace('BottomTab')}>
            <Image
              source={require('../../assets/go-back-left-arrow.png')}
              style={styles.headerBackIcon}
            />
          </TouchableOpacity>
          <Image
            source={require('../../assets/electronik.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Elektronik</Text>
          <Image
            source={require('../../assets/electronik.png')}
            style={styles.headerIcon}
          />
        </View>
        <ScrollView>
          <View>
            {this.state.data == '' ? (
              <View style={styles.viewLoading}>
                <LottieView
                  source={require('../../assets/21249-shopping-cart.json')}
                  autoPlay={true}
                  style={{height: 115}}
                />
                <Text style={{marginTop: 10}}>Harap tunggu...</Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.state.data.map((value, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.items}
                    onPress={() =>
                      this.props.navigation.replace('Detail', {
                        item: value,
                      })
                    }>
                    <Image source={{uri: value.image}} style={styles.image} />
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{flex: 1}}>
                        <Text numberOfLines={1} style={styles.textProduct}>
                          {value.name}
                        </Text>
                        <Text style={styles.textPrice}>
                          Rp.{this.toPrice(value.price)},-
                        </Text>
                      </View>
                    </View>
                    <View style={styles.viewAnother}>
                      <View style={styles.location}>
                        <Image
                          source={require('../../assets/map-placeholder.png')}
                          style={styles.map}
                        />
                        <Text style={styles.textLoc}>{value.user.alamat}</Text>
                      </View>
                      <TouchableOpacity>
                        <Image
                          source={require('../../assets/favorite-heart-outline-button.png')}
                          style={styles.fav}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
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
    backgroundColor: '#ff1f1f',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  headerIcon: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  headerBackIcon: {
    marginRight: 20,
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  items: {
    alignSelf: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 1,
    width: '47%',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
    alignSelf: 'center',
  },
  textProduct: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  textPrice: {
    color: '#22a800',
    fontWeight: 'bold',
  },
  viewAnother: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  map: {
    width: 15,
    height: 15,
    marginRight: 5,
    tintColor: 'grey',
  },
  location: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textLoc: {
    color: 'grey',
  },
  fav: {
    width: 20,
    height: 20,
    tintColor: 'tomato',
  },
  viewLoading: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '95%',
    margin: 10,
    alignItems: 'center',
    paddingVertical: 10,
    elevation: 2,
  },
});

export default ScreenElectronics;
