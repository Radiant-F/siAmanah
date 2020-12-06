import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
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
  constructor() {
    super();
    this.state = {
      token: '',
      user: [],
      data: '',
    };
    AsyncStorage.getItem('token').then((value) => {
      if (value != null) {
        this.setState({token: value});
        console.log('Token tersedia');
        this.getUser();
      } else {
        console.log('Token tidak ada');
      }
    });
  }

  getUser() {
    console.log('mengambil ID user..');
    fetch('https://si--amanah.herokuapp.com/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({user: responseJson.data});
        console.log('ID user saat ini: ' + this.state.user.id);
        this.getAllUser();
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  getAllUser() {
    console.log('mengambil chat..');
    fetch(`https://si--amanah.herokuapp.com/api/allmessage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({data: responseJson.data});
        console.log(this.state.data);
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  getMessage() {
    console.log('sedang mengambil chat..');
    fetch(
      `https://si--amanah.herokuapp.com/api/message/${this.state.user.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({data: responseJson[0]});
        console.log(this.state.data);
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

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
          {this.state.data == '' ? (
            <View style={styles.viewLoading}>
              <LottieView
                autoPlay
                style={{width: 120}}
                source={require('../assets/16289-no-comments.json')}
              />
            </View>
          ) : (
            <View>
              {this.state.data.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.viewChat}
                  onPress={() =>
                    this.props.navigation.navigate('ChatScreen', {data: value})
                  }>
                  <Image source={{uri: value.image}} style={styles.imgPp} />
                  <View style={styles.viewTextChat}>
                    <Text style={styles.textName}>{value.name}</Text>
                    <Text>Pesan terakhir</Text>
                  </View>
                  <Text>Waktu</Text>
                </TouchableOpacity>
              ))}
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
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '95%',
    elevation: 2,
    marginVertical: 10,
  },
});

export default Chat;
