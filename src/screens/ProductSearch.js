import React, {Component} from 'react';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

export default class ProductSearch extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      search: '',
      idProduk: '',
      idSeller: '',
      loading: true,
    };
  }

  toPrice(price) {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
  }

  productSearch() {
    if (this.state.search != '') {
      const {search} = this.state;
      const kirim = {search: search};
      console.log('mencari produk...');
      this.setState({loading: false, data: ''});
      fetch(`http://si--amanah.herokuapp.com/api/product/search`, {
        method: 'POST',
        body: JSON.stringify(kirim),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          if (responseJSON.status != 'Error') {
            this.setState({loading: false, data: responseJSON[0]});
            console.log(this.state.data);
          } else {
            this.setState({loading: true, data: ''});
            this.alert();
          }
        })
        .catch((err) => {
          this.setState({loading: false});
          alert('Terjadi kesalahan. ' + err);
        });
    } else {
      console.log('tidak ada input.');
    }
  }

  alert() {
    Alert.alert(
      'Oh Tidak',
      'Barang tidak ditemukan.',
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
            source={require('../assets/headerHome.png')}
            style={styles.headerBg}>
            <TouchableOpacity
              onPress={() => this.props.navigation.replace('BottomTab')}>
              <Image
                source={require('../assets/go-back-left-arrow.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Cari Barang</Text>
          </ImageBackground>
        </View>
        <ScrollView>
          <View style={styles.viewSearch}>
            <Image
              source={require('../assets/searching-magnifying-glass.png')}
              style={styles.searchIcon}
              onPress={() => this.props.navigation.replace('ProductSearch')}
            />
            <TextInput
              style={{paddingLeft: 10, flex: 1}}
              placeholder="Cari barang.."
              selectionColor="#4EC5F1"
              autoFocus={true}
              onEndEditing={() => this.productSearch()}
              onChangeText={(input) => this.setState({search: input})}
            />
          </View>
          {this.state.loading ? (
            <View style={styles.viewLoading}>
              <Text>Cari apa saja!</Text>
            </View>
          ) : (
            <View>
              {this.state.data == '' ? (
                <View style={styles.viewLoading}>
                  <LottieView
                    source={require('../assets/18013-searching.json')}
                    autoPlay={true}
                    style={{height: 115}}
                  />
                  <Text style={{marginTop: 10}}>Sedang mencari...</Text>
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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
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
                            source={require('../assets/map-placeholder.png')}
                            style={styles.map}
                          />
                          <Text style={styles.textLoc}>
                            {value.user.alamat}
                          </Text>
                        </View>
                        <TouchableOpacity>
                          <Image
                            source={require('../assets/favorite-heart-outline-button.png')}
                            style={styles.fav}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
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
  viewSearch: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 40,
    marginVertical: 5,
    elevation: 2,
    marginHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#4EC5F1',
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
