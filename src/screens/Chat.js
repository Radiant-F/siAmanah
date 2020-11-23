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

class Chat extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/headerChat.png')}
            style={styles.headerBg}>
            <Image
              source={require('../assets/chat-bubble.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerText}>Pesan</Text>
          </ImageBackground>
        </View>
        <ScrollView>
          {/* MAPPING START HERE */}
          <View>
            <TouchableOpacity
              style={styles.viewChat}
              onPress={() => this.props.navigation.navigate('ChatScreen')}>
              <Image
                source={require('../assets/aku.jpg')}
                style={styles.imgPp}
              />
              <View style={styles.viewTextChat}>
                <Text style={styles.textName}>Nama</Text>
                <Text>Pesan terakhir</Text>
              </View>
              <Text>Waktu</Text>
            </TouchableOpacity>
          </View>
          {/* END OF MAPPING */}
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

export default Chat;
