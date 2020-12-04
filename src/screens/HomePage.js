import React, {Component} from 'react';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import _ from 'lodash';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  RefreshControl,
} from 'react-native';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      token: '',
      user: {},
      is_first: '0',
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
          this.getItem();
        } else {
          console.log('Tidak ada token.');
        }
      })
      .catch((err) => console.log(err));
  }

  getItem() {
    console.log('mengambil semua barang..');
    this.setState({isLoading: true});
    fetch(`https://si--amanah.herokuapp.com/api/product`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        if (responseJson != '') {
          this.setState({
            isLoading: false,
            dataSource: responseJson[0].data,
            refresh: false,
          });
          console.log('barang terbaru: ' + responseJson[0].data[0].name);
        } else {
          this.setState({isLoading: false, refresh: false});
          alert('Error');
          console.log(responseJson);
        }
      })
      .catch((err) => {
        this.setState({isLoading: false, refresh: false});
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.headerView}>
          <ImageBackground
            source={require('../assets/headerHome.png')}
            style={styles.headerBg}>
            <Image
              source={require('../assets/logoTokoHeader.png')}
              style={styles.headerIconMain}
            />
            <Text style={styles.headerText}>Toko siAmanah</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Transaction')}>
              <Image
                source={require('../assets/shopping-cart.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Favorite')}>
              <Image
                source={require('../assets/favorite-heart-button.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={() => {
                this.setState({refresh: true});
                this.getItem();
              }}
            />
          }>
          <View style={{flex: 1, marginBottom: 10}}>
            <Swiper height={200} autoplay={true}>
              <TouchableOpacity style={styles.slide}>
                <Image
                  source={require('../assets/swiperMasjid.jpg')}
                  style={styles.swiperImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.slide}>
                <Image
                  source={require('../assets/swiperDonasi.png')}
                  style={styles.swiperImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.slide}>
                <Image
                  source={require('../assets/swiperRTX.png')}
                  style={styles.swiperImage}
                />
              </TouchableOpacity>
            </Swiper>
          </View>
          <View style={styles.viewCategory}>
            <View style={styles.subViewCategory}>
              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.replace('Electronics')}>
                <Image
                  source={require('../assets/electronik.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Elektronik</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.replace('Books')}>
                <Image
                  source={require('../assets/buku.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Buku</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.replace('Clothes')}>
                <Image
                  source={require('../assets/pakaian.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Pakaian</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.textRecommendation}> Baru Ditambah </Text>
          <View
            style={styles.viewSearch}
            onPress={() => this.props.navigation.replace('ProductSearch')}>
            <Image
              source={require('../assets/searching-magnifying-glass.png')}
              style={styles.searchIcon}
              onPress={() => this.props.navigation.replace('ProductSearch')}
            />
            <Text
              style={{paddingLeft: 10, flex: 1}}
              onPress={() => this.props.navigation.replace('ProductSearch')}>
              Cari barang..
            </Text>
          </View>
          {/* ============ MAP API ============ */}
          {this.state.isLoading ? (
            <View style={styles.viewLoading}>
              <LottieView
                source={require('../assets/21249-shopping-cart.json')}
                autoPlay={true}
                style={{width: 170}}
              />
            </View>
          ) : (
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {this.state.dataSource.map((value, index) => (
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
                        source={require('../assets/map-placeholder.png')}
                        style={styles.map}
                      />
                      <Text style={styles.textLoc}>{value.user.alamat}</Text>
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
          {/* ============ MAP API ============ */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    // width: '100%',
    backgroundColor: '#4EC5F1',
    alignItems: 'center',
    // justifyContent: 'center',
    // height: 60,
  },
  headerBg: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    resizeMode: 'center',
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
  headerSearch: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerIcon: {
    width: 25,
    height: 25,
    tintColor: 'white',
    marginLeft: 15,
  },
  headerIconMain: {
    width: 35,
    height: 35,
    marginRight: 15,
    tintColor: 'white',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#4EC5F1',
  },
  wrapper: {
    height: 200,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    flex: 1,
  },
  text: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  swiperImage: {
    width: '100%',
    height: '100%',
  },
  viewCategory: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 5,
  },
  subViewCategory: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  subViewCategory2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  viewCategoryIcon: {
    width: 50,
    height: 50,
    margin: 5,
  },
  textCategory: {
    flex: 1,
    borderTopColor: 'black',
    borderTopWidth: 2,
    paddingTop: 3,
    marginHorizontal: 5,
  },
  touchCategory: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    width: 90,
    height: 90,
    backgroundColor: '#c2efff',
    elevation: 2,
  },
  textRecommendation: {
    fontSize: 20,
    fontWeight: 'bold',
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
  viewTextProduct: {
    alignSelf: 'flex-start',
  },
  textProduct: {
    fontSize: 20,
    fontWeight: 'bold',
    // borderTopWidth: 1,
    // borderTopColor: 'black',
    paddingTop: 10,
    // flex: 1,
  },
  textPrice: {
    color: '#22a800',
    fontWeight: 'bold',
  },
  textDesc: {},
  viewLoading: {
    width: '95%',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    margin: 10,
    elevation: 3,
  },
  fav: {
    width: 20,
    height: 20,
    tintColor: 'tomato',
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
});

export default HomePage;
