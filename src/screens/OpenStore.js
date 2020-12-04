import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

class OpenStore extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      loading: false,
      name: '',
      description: '',
      alamat: '',
      photo: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token')
      .then((token) => {
        JSON.stringify(token);
        if (token !== null) {
          this.setState({token: token});
          console.log(this.state.token);
        } else {
          alert('Token hilang!');
        }
      })
      .catch((err) => console.log(err));
  }

  addToko() {
    const {name, description, alamat, photo} = this.state;
    if (name && description && alamat && photo !== '') {
      const product = {
        name: name,
        description: alamat,
        alamat: alamat,
      };
      this.setState({loading: true});
      fetch('http://si--amanah.herokuapp.com/api/shop', {
        method: 'POST',
        body: this.createFormData(photo, product),
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          console.log(responseJSON);
          if (responseJSON.status != 'Error') {
            this.succes();
            this.setState({loading: false});
            this.props.navigation.replace('BottomTab', {screen: 'Profile'});
          }
        })
        .catch((error) => {
          console.log('Upload error', error);
          this.failed();
          this.setState({loading: false});
        });
    } else {
      this.unfin();
      this.setState({loading: false});
    }
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({photo: response});
        console.log(this.state.photo);
      }
    });
  };

  succes() {
    Alert.alert(
      'Toko Dibuat!',
      'Mulai bisnis Anda dengan ucapan basmallah.',
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
  }

  failed() {
    Alert.alert(
      'Terjadi Kesalahan',
      'Periksa kode Anda.',
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
  }

  unfin() {
    Alert.alert(
      'Perhatian',
      'Harap isi semua form.',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
        },
      ],
      {cancelable: false},
    );
  }

  createFormData(photo, body) {
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
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../assets/front-store.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Buka Toko</Text>
        </View>
        <View style={styles.input}>
          <TextInput
            style={styles.textInput}
            placeholder="Nama Toko"
            onChangeText={(input) => this.setState({name: input})}
          />
        </View>
        <TouchableOpacity
          style={styles.viewPP}
          onPress={() => this.handleChoosePhoto()}>
          {this.state.photo !== '' ? (
            <Image source={{uri: this.state.photo.uri}} style={styles.pp} />
          ) : (
            <View style={styles.ppnt}>
              <Text style={styles.textUploadPp}>Foto Toko</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.input}>
          <TextInput
            style={styles.textInput}
            placeholder="Deskripsi"
            onChangeText={(input) => this.setState({description: input})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Alamat Toko"
            onChangeText={(input) => this.setState({alamat: input})}
          />
        </View>
        <View style={styles.viewOption}>
          <TouchableOpacity
            style={styles.touchOption}
            onPress={() =>
              this.props.navigation.replace('BottomTab', {screen: 'Profil'})
            }>
            <Text style={styles.text}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchOption1}
            onPress={() => this.addToko()}>
            {this.state.loading ? (
              <ActivityIndicator size="small" color="grey" />
            ) : (
              <Text style={styles.text}>Lanjut</Text>
            )}
          </TouchableOpacity>
        </View>
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
  ppnt: {
    width: 120,
    height: 120,
    borderColor: '#ffaa00',
    borderWidth: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  textUploadPp: {
    textAlign: 'center',
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
  touchOption: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
    borderRadius: 10,
    width: 150,
    elevation: 2,
  },
  touchOption1: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48e5e5',
    borderRadius: 10,
    width: 150,
    elevation: 2,
  },
  viewOption: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  textInput: {},
});

export default OpenStore;
