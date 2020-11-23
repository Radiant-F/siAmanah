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
} from 'react-native';

class OpenStore extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      dataSource: [],
      modal: false,
      loading: false,
      photo: '',
      namaToko: '',
      alamat: '',
      kodePos: '',
      namaKota: '',
      noTelepon: '',
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
    const {
      photo,
      namaKota,
      namaToko,
      alamat,
      kodePos,
      noTelepon,
      token,
    } = this.state;
    if (
      photo &&
      namaKota &&
      namaToko &&
      alamat &&
      kodePos &&
      noTelepon &&
      token !== ''
    ) {
      const product = {
        nama_toko: namaToko,
        alamat: alamat,
        no_telepon: noTelepon,
        kota: namaKota,
        kd_pos: kodePos,
      };
      this.setState({loading: true});
      fetch('http://app-a-store.herokuapp.com/api/store/create', {
        method: 'POST',
        body: this.createFormData(photo, product),
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response) console.log('Upload produk sukses.', response);
          alert('Toko telah dibuat!');
          this.setState({loading: false});
          this.props.navigation.replace('BottomTab', {screen: 'Home'});
        })
        .catch((error) => {
          console.log('Upload error', error);
          alert('Gagal ditambahkan');
          this.setState({loading: false});
        });
    } else {
      alert('Harap isi semua form.');
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

  createFormData(photo, body) {
    const data = new FormData();
    data.append('thumbnail', {
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
            onChangeText={(input) => this.setState({namaToko: input})}
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
            placeholder="Alamat Toko"
            onChangeText={(input) => this.setState({alamat: input})}
          />
          <TextInput
            keyboardType={'number-pad'}
            placeholder="Nomor Telepon"
            onChangeText={(input) => this.setState({noTelepon: input})}
          />
          <TextInput
            placeholder="Nama Kota"
            onChangeText={(input) => this.setState({namaKota: input})}
          />
          <TextInput
            keyboardType={'number-pad'}
            placeholder="Kode Pos"
            onChangeText={(input) => this.setState({kodePos: input})}
          />
        </View>
        <View style={styles.viewOption}>
          <TouchableOpacity
            style={styles.touchOption}
            onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.text}> Batal </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchOption1}
            onPress={() => this.addToko()}>
            {this.state.loading ? (
              <ActivityIndicator size="small" color="grey" />
            ) : (
              <Text style={styles.text}> Lanjut </Text>
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
