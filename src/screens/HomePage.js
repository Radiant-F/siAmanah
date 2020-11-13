import React, {Component} from 'react';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';

export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [''],
      token: '',
    };
  }

  componentDidMount() {
    fetch('http://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((responseJson) => {
        JSON.stringify(responseJson);
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        });
      });
    //   .catch((err) => console.log(err));
    // AsyncStorage.getItem('token')
    //   .then((token) => {
    //     if (token !== null) {
    //       this.setState({token: token});
    //     } else {
    //       alert('Token hilang!');
    //     }
    //   })
    //   .then(() => this.getItem());
    // }
  }

  getItem() {
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
        if (responseJson != null) {
          console.log(responseJson);
          this.setState({
            isLoading: false,
            dataSource: responseJson,
          });
        } else {
          alert('error');
          console.log(responseJson);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() =>
          this.props.navigation.navigate('Detail', {
            id: item.id,
          })
        }>
        <Image
          source={require('../assets/elektronikHeadset.jpg')}
          style={styles.image}
        />
        <View style={styles.viewTextProduct}>
          <Text style={styles.textProduct}>{item.title}</Text>
          <Text style={styles.textPrice}>Rp.50.000,-</Text>
          <Text style={styles.textDesc}>{item.body}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>
            Selamat datang, {this.state.dataSource[0].id}.
          </Text>
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
        </View>
        <ScrollView>
          <View style={{flex: 1, marginBottom: 10}}>
            <Swiper height={250} autoplay={true}>
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
                onPress={() => this.props.navigation.navigate('Electronics')}>
                <Image
                  source={require('../assets/electronik.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Elektronik</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.navigate('Books')}>
                <Image
                  source={require('../assets/buku.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Buku</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.navigate('Furnitures')}>
                <Image
                  source={require('../assets/furnitur.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Furnitur</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.subViewCategory2}>
              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.navigate('Clothes')}>
                <Image
                  source={require('../assets/pakaian.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Pakaian</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.navigate('Foods')}>
                <Image
                  source={require('../assets/makanan.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Makanan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchCategory}
                onPress={() => this.props.navigation.navigate('Antique')}>
                <Image
                  source={require('../assets/antik.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Antik</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.textRecommendation}> Baru Ditambah </Text>
          <View style={styles.viewSearch}>
            <Image
              source={require('../assets/searching-magnifying-glass.png')}
              style={styles.searchIcon}
            />
            <TextInput
              style={{paddingLeft: 10, flex: 1}}
              placeholder="Cari barang.."
              placeholderTextColor="#4EC5F1"
              selectionColor="#4EC5F1"
            />
          </View>
          {/* ============ FLATLIST API ============ */}
          {this.state.isLoading ? (
            <View>
              <ActivityIndicator size="large" color />
            </View>
          ) : (
            <FlatList
              numColumns={2}
              data={this.state.dataSource}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {/* ============ FLATLIST API ============ */}
          {/* ============ MAP API ============ */}
          {/* <View>
            {this.state.isLoading ? (
              <View>
                <ActivityIndicator size="large" color="red" />
              </View>
            ) : (
              <View style={styles.items}>
                {this.state.dataSource.map((value, index) => (
                  <View>
                    <TouchableOpacity key={index}>
                      <Image source={value.photo} style={styles.image} />
                      <View style={styles.viewTextItems}>
                        <Text style={styles.textName}>{value.task}</Text>
                        <Text style={styles.textDesc}>{value.desc}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity key={index}>
                      <Image source={value.photo} style={styles.image} />
                      <View style={styles.viewTextItems}>
                        <Text style={styles.textName}>{value.task}</Text>
                        <Text style={styles.textDesc}>{value.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View> */}
          {/* ============ MAP API ============ */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#4EC5F1',
    alignItems: 'center',
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
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
    width: '47.5%',
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 5,
  },
  viewTextProduct: {
    alignSelf: 'flex-start',
  },
  textProduct: {
    marginVertical: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textPrice: {
    color: '#22a800',
  },
  textDesc: {},
});

export default HomePage;
