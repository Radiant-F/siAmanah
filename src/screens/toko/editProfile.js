import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Button,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Alert,
} from 'react-native';

export default class editProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      name: '',
      alamat: '',
      nomor_telpon: '',
      email: '',
      photo: '',
      image: '',
      password: '',
      loading: false,
      user: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        console.log('token tersedia.');
        this.setState({token: token});
        this.getUser();
      } else {
        alert('Tidak ada token.');
      }
    });
  }

  getUser() {
    console.log('sedang mengambil user..');
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
          name: responseJson.data.name,
          alamat: responseJson.data.alamat,
          email: responseJson.data.email,
          nomor_telpon: responseJson.data.nomor_telpon,
          image: responseJson.data.image,
        });
        console.log(this.state.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  editProfile() {
    if (this.state.password != '') {
      const {name, alamat, nomor_telpon, email, password, photo} = this.state;
      if (photo.name === undefined) {
        const profile = {
          name: name,
          alamat: alamat,
          email: email,
          nomor_telpon: nomor_telpon,
          password_confirmation: password,
        };
        this.setState({loading: true});
        fetch(`https://si--amanah.herokuapp.com/api/profile`, {
          method: 'POST',
          body: this.createFormData(photo, profile),
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            if (response.status == 'Success') {
              console.log('upload succes', response);
              this.setState({user: '', loading: false});
              ToastAndroid.show('Profil telah disunting', ToastAndroid.SHORT);
              this.getUser();
            } else {
              alert('Error');
              this.setState({loading: false});
            }
          })
          .catch((error) => {
            this.setState({loading: false});
            console.log(error);
          });
      } else {
        alert('Gambar harus dirubah');
      }
    } else {
      this.alert();
    }
  }

  createFormData = (photo, body) => {
    const data = new FormData();
    data.append('image', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

  handleEditPhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({photo: response});
        console.log(JSON.stringify(response));
      }
    });
  };

  logout() {
    console.log('dadah.');
    AsyncStorage.removeItem('token');
    this.props.navigation.replace('Login');
  }

  alert() {
    Alert.alert(
      'Demi Keamanan',
      'Harap konfimasi password Anda.',
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.user == '' ? (
          <View style={styles.viewLoading}>
            <LottieView
              source={require('../../assets/8205-loading-animation.json')}
              autoPlay={true}
              style={{height: 120}}
            />
          </View>
        ) : (
          <View>
            <ScrollView>
              <TouchableOpacity
                style={styles.viewPP}
                onPress={() => this.handleEditPhoto()}>
                {this.state.photo !== '' ? (
                  <Image
                    source={{uri: this.state.photo.uri}}
                    style={styles.pp}
                  />
                ) : (
                  <Image source={{uri: this.state.image}} style={styles.pp} />
                )}
              </TouchableOpacity>
              <View style={styles.input}>
                <Text>Nama</Text>
                <TextInput
                  value={this.state.name}
                  placeholder="Nama baru"
                  onChangeText={(input) => this.setState({name: input})}
                  style={styles.textInput}
                />
                <Text>Alamat</Text>
                <TextInput
                  value={this.state.alamat}
                  placeholder="Alamat rumah"
                  onChangeText={(input) => this.setState({alamat: input})}
                  style={styles.textInput}
                />
                <Text>Email</Text>
                <TextInput
                  value={this.state.email}
                  placeholder="Email baru"
                  onChangeText={(input) => this.setState({email: input})}
                  style={styles.textInput}
                />
                <Text>Nomor Telepon</Text>
                <TextInput
                  keyboardType={'number-pad'}
                  value={`${this.state.nomor_telpon}`}
                  placeholder="Nomor Telepon"
                  onChangeText={(input) => this.setState({nomor_telpon: input})}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.input}>
                <Text>Konfirmasi Password Anda</Text>
                <TextInput
                  secureTextEntry={true}
                  placeholder="Password"
                  onChangeText={(input) => this.setState({password: input})}
                  style={styles.textInput}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginVertical: 10,
                }}>
                <TouchableOpacity
                  style={styles.touchAbort}
                  onPress={() =>
                    this.props.navigation.replace('BottomTab', {
                      screen: 'Profile',
                    })
                  }>
                  <Text style={styles.text}> Kembali </Text>
                </TouchableOpacity>
                {this.state.loading ? (
                  <View style={styles.touchEdit2}>
                    <LottieView
                      source={require('../../assets/8205-loading-animation.json')}
                      autoPlay={true}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.touchEdit}
                    onPress={() => this.editProfile()}>
                    <Text style={styles.text}> Edit Profil </Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.touchLogInOut}
                onPress={() => this.logout()}>
                <Text style={styles.text}> Logout </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#50c6f1',
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
  input: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 1,
    margin: 5,
    padding: 5,
    paddingHorizontal: 20,
  },
  viewPP: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 1,
    margin: 5,
    padding: 5,
  },
  pp: {
    width: 120,
    height: 120,
    borderColor: '#4EC5F1',
    borderWidth: 2,
  },
  touchAbort: {
    width: 150,
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffaa00',
    borderRadius: 10,
  },
  touchEdit: {
    width: 150,
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    borderRadius: 10,
  },
  touchEdit2: {
    width: 150,
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
    marginTop: 5,
  },
  touchLogInOut: {
    width: 155,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'tomato',
    borderRadius: 10,
    marginBottom: 10,
  },
  viewLoading: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '95%',
    margin: 10,
    elevation: 2,
  },
});
