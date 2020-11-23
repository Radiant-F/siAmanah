import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {product} from '../../components/Data';

class ScreenBooks extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/buku.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Buku</Text>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {product.books.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={styles.items}
              onPress={() =>
                this.props.navigation.navigate('Detail', {
                  item: value,
                })
              }>
              <Image source={{uri: value.image}} style={styles.image} />
              <View style={styles.viewTextProduct}>
                <Text style={styles.textProduct}>{value.name}</Text>
                <Text style={styles.textPrice}>Rp.{value.price},-</Text>
                <Text style={styles.textDesc}>{value.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1fbcff',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
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
  items: {
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
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
    borderTopWidth: 1,
    borderTopColor: 'black',
    paddingTop: 10,
    // flex: 1,
  },
  textPrice: {
    color: '#22a800',
    fontWeight: 'bold',
  },
  textDesc: {},
});

export default ScreenBooks;
