import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

export class Chat extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../assets/chat-bubble.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Pesan</Text>
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
    backgroundColor: '#4EC5F1',
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

export default Chat;
