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
  TextInput,
} from 'react-native';

class ChatScreen2 extends Component {
  constructor() {
    super();
    this.state = {
      sellerName: '',
      receiver_id: '',
      messages: '',
      token: '',
      pesan: [],
      message: [],
      allMessage: [],
      user: '',
      loading: false,
    };
  }

  componentDidMount() {
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
    console.log('mengambil id user..');
    fetch('http://si--amanah.herokuapp.com/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({user: responseJson.data.id});
        console.log('id user saat ini: ' + this.state.user);
        this.getPesan();
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  getPesan() {
    console.log('mengambil chat..');
    fetch(`http://si--amanah.herokuapp.com/api/allmessage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // let semuaPesan = responseJson.data.Message.concat(
        //   responseJson.data.pesan,
        // );
        // semuaPesan.sort((a, b) => a.id - b.id);
        this.setState({
          allMessage: responseJson.data,
        });
        console.log('All message ', this.state.allMessage);
      })
      .catch((err) => {
        console.log('Terjadi kesalahan. ' + err);
      });
  }

  sendMessage() {
    if (this.state.messages != '') {
      const {messages, receiver_id} = this.state;
      const kirimData = {message: messages, receiver_id: receiver_id};
      this.setState({loading: true, messages: ''});
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
            this.getPesan();
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
    // console.log('ini dari render: ', this.state.allMessage[0].message);
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
          {this.state.allMessage.length == 0 ? (
            <View style={styles.viewLoading}>
              <LottieView
                autoPlay
                style={{width: 120}}
                source={require('../assets/8604-message-loading.json')}
              />
            </View>
          ) : (
            <View>
              {/* {this.state.pesan.map((value, index) => (
                <View key={index} style={styles.viewText}>
                  <View style={styles.viewMessageLeft}>
                    <Text>{value.message}</Text>
                  </View>
                </View>
              ))}
              {this.state.message.map((value, index) => (
                <View key={index} style={styles.viewText}>
                  <View style={styles.viewMessageRight}>
                    <Text>{value.message}</Text>
                  </View>
                </View>
              ))} */}
              {this.state.allMessage.map((value, index) => {
                if (value.from == this.state.user) {
                  return (
                    <View key={index} style={styles.viewText}>
                      <View style={styles.viewMessageRight}>
                        <Text>{value.message}</Text>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View key={index} style={styles.viewText}>
                      <View style={styles.viewMessageLeft}>
                        <Text>{value.message}</Text>
                      </View>
                    </View>
                  );
                }
              })}
            </View>
          )}
        </ScrollView>
        <View style={styles.viewSend}>
          <TextInput
            value={this.state.messages}
            placeholder="Tulis Pesan..."
            style={styles.input}
            onChangeText={(input) => this.setState({messages: input})}
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

export default ChatScreen2;
