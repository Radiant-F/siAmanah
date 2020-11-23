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
  TextInput,
} from 'react-native';

class ChatScreen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/headerChat.png')}
            style={styles.headerBg}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../assets/go-back-left-arrow.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.headerText}>
              Nama pengirim
            </Text>
          </ImageBackground>
        </View>
        <ScrollView>
          <View style={styles.viewText}>
            <View style={styles.viewMessageRight}>
              <Text>Kanan</Text>
            </View>
            <View style={styles.viewMessageLeft}>
              <Text>Kiri</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.viewSend}>
          <TextInput placeholder="Tulis Pesan..." style={styles.input} />
          <TouchableOpacity>
            <Image
              source={require('../assets/send-button.png')}
              style={styles.imgSend}
            />
          </TouchableOpacity>
        </View>
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
  viewSend: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#4EC5F1',
    paddingHorizontal: 10,
    bottom: 0,
    position: 'absolute',
  },
  imgSend: {
    width: 35,
    height: 35,
    marginLeft: 10,
    tintColor: '#ffffff',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    flex: 1,
    marginVertical: 10,
    borderRadius: 10,
  },
  viewText: {
    padding: 10,
  },
  viewMessageRight: {
    backgroundColor: '#ff9d5c',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  viewMessageLeft: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
});

export default ChatScreen;
