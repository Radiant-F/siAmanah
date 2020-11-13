import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

export class ScreenFoods extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../assets/makanan.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Makanan</Text>
        </View>
        <ScrollView>
          <Text> Kontak </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff961f',
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
});

export default ScreenFoods;
