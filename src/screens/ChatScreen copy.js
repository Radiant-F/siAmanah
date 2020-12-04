import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import React, {Component} from 'react';
import Pusher from 'pusher-js/react-native';
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
  constructor() {
    super();
    this.state = {
      sellerName: '',
      receiver_id: '',
      message: '',
      token: '',
      history: [],
      loading: false,
    };
    var pusher = new Pusher('XXX_APP_KEY', {
      cluster: 'XXX_APP_CLUSTER',
    });
    var my_channel = pusher.subscribe('pubchat');
    //bind and listen for chat events
    my_channel.bind('message_sent', (data) => {
      this.state.messages_array.push(data);
      this.setState({
        text: '',
      });
    });
  }

  componentDidMount() {
    this.getToken();
  }

  getToken() {
    AsyncStorage.getItem('token')
      .then((value) => {
        if (value != null) {
          this.setState({
            token: value,
            receiver_id: this.props.route.params.data.id,
          });
          console.log('token tersedia');
          this.getUser();
        } else {
          console.log('token hilang');
        }
      })
      .catch((err) => console.log('Terjadi kesalahan. ' + err));
  }

  getUser() {
    console.log('mengambil data..');
    fetch('http://si--amanah.herokuapp.com/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          user: responseJson.data,
        });
        console.log('ID user saat ini: ' + this.state.user.id);
        console.log('nama penjual: ' + this.props.route.params.data.id);
        console.log('ID penjual: ' + this.state.receiver_id);
        this.getMessage();
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  getMessage() {
    console.log('sedang mengambil chat..');
    fetch(
      `http://si--amanah.herokuapp.com/api/message/${this.state.receiver_id}`,
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
        let riwayat = responseJson[0];
        riwayat.sort((a, b) => a.id - b.id);
        this.setState({history: riwayat});
        console.log('semua chat terambil.');
        this.pusher();
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  sendMessage() {
    if (this.state.message != '') {
      const {message, receiver_id} = this.state;
      const kirimData = {message: message, receiver_id: receiver_id};
      this.setState({loading: true, message: ''});
      console.log('sedang mengirim pesan..');
      fetch(`http://si--amanah.herokuapp.com/api/message`, {
        method: 'POST',
        body: JSON.stringify(kirimData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.text())
        .then((responseJSON) => {
          const {status} = responseJSON;
          if (status != 'error') {
            this.setState({loading: false});
            console.log('pesan terkirim.');
            this.getMessage();
          } else {
            this.setState({loading: false});
            console.log('pesan gagal terkirim.');
          }
        })
        .catch((err) => {
          this.setState({loading: false});
          alert('terjadi kesalahan. ' + err);
        });
    } else {
      console.log('tidak ada yang dikirim.');
    }
  }

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
              {this.props.route.params.data.name}
            </Text>
          </ImageBackground>
        </View>
        <ScrollView>
          {this.state.history == '' ? (
            <View style={styles.viewLoading}>
              <LottieView
                autoPlay
                style={{width: 120}}
                source={require('../assets/8604-message-loading.json')}
              />
            </View>
          ) : (
            <View>
              {this.state.history.map((value, index) => (
                <View key={index} style={styles.viewText}>
                  {value.from == this.state.user.id ? (
                    <View style={styles.viewMessageRight}>
                      <Text>{value.message}</Text>
                    </View>
                  ) : (
                    <View style={styles.viewMessageLeft}>
                      <Text>{value.message}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.viewSend}>
          <TextInput
            value={this.state.message}
            placeholder="Tulis Pesan..."
            style={styles.input}
            onChangeText={(input) => this.setState({message: input})}
          />
          <TouchableOpacity onPress={() => this.sendMessage()}>
            <Image
              source={require('../assets/send-button.png')}
              style={styles.imgSend}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 70}}></View>
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
    padding: 5,
  },
  viewMessageRight: {
    backgroundColor: '#ff9d5c',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  viewMessageLeft: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 1,
    marginBottom: 10,
    margin: 10,
    width: '95%',
  },
});

export default ChatScreen;
