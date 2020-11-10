import React, {Component} from 'react';
import Swiper from 'react-native-swiper';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export class HomePage extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.headerView}>
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
          <TouchableOpacity>
            <Image
              source={require('../assets/shopping-cart.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/chat-bubbles.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{flex: 1}}>
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
                <Text style={styles.text}> Halo </Text>
              </TouchableOpacity>
            </Swiper>
          </View>
          <View style={styles.viewCategory}>
            <View style={styles.subViewCategory}>
              <TouchableOpacity style={styles.touchCategory}>
                <Image
                  source={require('../assets/electronik.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Elektronik</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchCategory}>
                <Image
                  source={require('../assets/buku.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Buku</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchCategory}>
                <Image
                  source={require('../assets/furnitur.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Furnitur</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.subViewCategory2}>
              <TouchableOpacity style={styles.touchCategory}>
                <Image
                  source={require('../assets/pakaian.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Pakaian</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchCategory}>
                <Image
                  source={require('../assets/makanan.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Makanan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchCategory}>
                <Image
                  source={require('../assets/buku.png')}
                  style={styles.viewCategoryIcon}
                />
                <Text style={styles.textCategory}>Buku</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 40,
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
    marginVertical: 20,
    elevation: 2,
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
    backgroundColor: '#4EC5F1',
    elevation: 2,
  },
});

export default HomePage;
