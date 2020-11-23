import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
// import Picker from '@react-native-picker/picker'
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
  Picker,
} from 'react-native';

class ProfileEdit extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      name: '',
      description: '',
      category_id: '',
      category: [],
      price: '',
      weight: '',
      photo: '',
      stock: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        console.log('token tersedia.');
        this.setState({token: token});
        this.getCategory();
      } else {
        console.log('Tidak ada token. User harus login atau daftar.');
      }
    });
  }

  getCategory() {
    fetch('http://si--amanah.herokuapp.com/api/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({category: responseJson.data});
        console.log(responseJson.data);
        console.log('selesai.');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addProduct() {
    const {
      name,
      description,
      category_id,
      price,
      weight,
      photo,
      stock,
    } = this.state;
    if (
      name !== '' &&
      description !== '' &&
      category_id !== '' &&
      price !== '' &&
      weight !== '' &&
      photo !== '' &&
      stock !== ''
    ) {
      const product = {
        name: name,
        description: description,
        category_id: category_id,
        price: price,
        weight: weight,
        stock: stock,
      };
      this.setState({loading: true});
      fetch('http://si--amanah.herokuapp.com/api/product', {
        method: 'POST',
        body: this.createFormData(photo, product),
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) this.setState({loading: false});
          alert('Barang telah ditambahkan!');
          console.log(response);
          this.props.navigation.replace('BottomTab', {screen: 'Profile'});
        })
        .catch((error) => {
          this.setState({loading: false});
          console.log(error);
          alert('Upload error.');
        });
    } else {
      this.setState({loading: false});
      alert('Isi semua form.');
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

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../assets/cartPurchase.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Tambah Produk</Text>
        </View>
        <ScrollView>
          <View style={styles.input}>
            <Text>Nama Produk</Text>
            <TextInput
              placeholder="eg. Keqing Cosplay"
              onChangeText={(input) => this.setState({name: input})}
              style={styles.textInput}
            />
          </View>
          <TouchableOpacity
            style={styles.viewPP}
            onPress={() => this.handleEditPhoto()}>
            {this.state.photo !== '' ? (
              <Image source={{uri: this.state.photo.uri}} style={styles.pp} />
            ) : (
              <View style={styles.pp}>
                <Text style={styles.textPlus}>+</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.input}>
            <Text>Kategori</Text>
            <Picker
              mode="dropdown"
              selectedValue={this.state.category_id}
              onValueChange={(a) => this.setState({category_id: a})}>
              {this.state.category.map((value, index) => (
                <Picker.Item key={index} label={value.name} value={value.id} />
              ))}
            </Picker>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text>Stok</Text>
                  <TextInput
                    keyboardType={'number-pad'}
                    placeholder="eg. 50"
                    onChangeText={(input) => this.setState({stock: input})}
                    style={styles.textInput2}
                  />
                </View>
                <View>
                  <Text>Berat (KG)</Text>
                  <TextInput
                    keyboardType={'number-pad'}
                    placeholder="eg. 5"
                    onChangeText={(input) => this.setState({weight: input})}
                    style={styles.textInput2}
                  />
                </View>
              </View>
            </View>
            <Text>Deskripsi</Text>
            <TextInput
              placeholder="eg. Untuk wanita!"
              onChangeText={(input) => this.setState({description: input})}
              style={styles.textInput}
            />
            <Text>Harga</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="eg. Rp.50.000,-"
              onChangeText={(input) => this.setState({price: input})}
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
                this.props.navigation.replace('BottomTab', {screen: 'Profil'})
              }>
              <Text style={styles.text}> Batal </Text>
            </TouchableOpacity>
            {this.state.loading ? (
              <View style={styles.touchEdit2}>
                <LottieView
                  source={require('../assets/8205-loading-animation.json')}
                  autoPlay={true}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.touchEdit}
                onPress={() => this.addProduct()}>
                <Text style={styles.text}> Tambahkan </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
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
    width: 30,
    height: 32,
    tintColor: 'white',
  },
  input: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 1,
    margin: 5,
    padding: 15,
    // paddingHorizontal: 20,
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
    justifyContent: 'center',
  },
  touchAbort: {
    width: 160,
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
    borderRadius: 10,
  },
  touchEdit: {
    width: 160,
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    borderRadius: 10,
  },
  touchEdit2: {
    width: 160,
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
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
    marginTop: 5,
  },
  textInput2: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
    marginTop: 5,
    width: 150,
  },
  textPlus: {
    alignSelf: 'center',
    fontSize: 50,
  },
});

export default ProfileEdit;
