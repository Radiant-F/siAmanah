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
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

class ChatScreen extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      sellerName: '',
      receiver_id: '',
      text: '',
      token: '',
      history: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getToken();
    Pusher.logToConsole = true;
    var pusher = new Pusher('714107c06ab063eee783', {
      cluster: 'ap1',
    });
    var channel = pusher.subscribe('my-channel');
    channel.bind('my-event', (data) => {
      // alert(JSON.stringify(data));
      this.getMessage();
    });
  }

  getToken() {
    AsyncStorage.getItem('token')
      .then((value) => {
        if (value != null) {
          this.setState({token: value});
          this.getUser();
          this.getMessage();
        }
      })
      .catch((err) => console.log('Terjadi kesalahan. ' + err));
  }

  getUser() {
    console.log('mengambil data..');
    fetch('https://si--amanah.herokuapp.com/api/profile', {
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
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  getMessage() {
    console.log('sedang mengambil chat..');
    fetch(
      `https://si--amanah.herokuapp.com/api/message/${this.props.route.params.data.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((response) => {
        let riwayat = response.data;
        riwayat.sort((a, b) => a.id - b.id);
        this.setState({history: riwayat, loading: false});
        console.log(riwayat);
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  sendMessage() {
    if (this.state.text != '') {
      this.setState({loading: true, text: ''});
      console.log('sedang mengirim pesan..');
      fetch(
        `https://si--amanah.herokuapp.com/api/message/${this.props.route.params.data.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.token}`,
          },
          body: JSON.stringify({message: this.state.text}),
        },
      )
        .then((response) => response.json())
        .then((responseJSON) => {
          console.log(responseJSON.data);
          const {status} = responseJSON;
          if (status != 'error') {
            this.setState({loading: false});
            console.log('pesan terkirim');
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

  deletePesan(id) {
    this.setState({loading: true});
    fetch(`https://si--amanah.herokuapp.com/api/message/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        const {status} = json;
        if (status == 'Success') {
          this.getMessage();
          ToastAndroid.show('Pesan dihapus.', ToastAndroid.SHORT);
          this.setState({loading: false});
        }
      })
      .catch((err) => log(err), this.setState({loading: false}));
  }

  confirmDelete(id) {
    Alert.alert(
      '',
      'Hapus Pesan?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Hapus',
          onPress: () => this.deletePesan(id),
        },
      ],
      {cancelable: false},
    );
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
        <ScrollView snapToEnd={true}>
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
                  {value.to == this.state.user.id ? (
                    <View style={styles.viewMessageLeft}>
                      <Text style={styles.textMessage}>{value.message}</Text>
                      <Text style={styles.textTime2}>{value.created_at}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onLongPress={() => this.confirmDelete(value.id)}
                      style={styles.viewMessageRight}>
                      <Text style={styles.textMessage}>{value.message}</Text>
                      <Text style={styles.textTime}>{value.created_at}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.viewSend}>
          <TextInput
            value={this.state.text}
            placeholder="Tulis Pesan..."
            style={styles.input}
            onChangeText={(input) => this.setState({text: input})}
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
    paddingHorizontal: 5,
    borderRadius: 5,
    elevation: 2,
    maxWidth: '80%',
  },
  viewMessageLeft: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    borderRadius: 5,
    elevation: 2,
    maxWidth: '80%',
  },
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    // paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 1,
    marginBottom: 10,
    margin: 10,
    width: '95%',
  },
  textTime: {
    alignSelf: 'flex-end',
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 10,
    margin: 5,
  },
  textTime2: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 10,
    margin: 5,
  },
  textMessage: {
    marginHorizontal: 5,
    marginTop: 5,
  },
});

export default ChatScreen;
