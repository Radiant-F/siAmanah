import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

export class ScreenAntique extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../assets/antik.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Antik</Text>
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
    backgroundColor: '#e07f00',
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

export default ScreenAntique;
