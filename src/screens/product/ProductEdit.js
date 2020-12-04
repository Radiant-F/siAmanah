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
  Alert,
  ToastAndroid,
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
      id: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        console.log('token tersedia.');
        this.setState({
          token: token,
          name: this.props.route.params.data.name,
          description: this.props.route.params.data.description,
          price: this.props.route.params.data.price,
          stock: this.props.route.params.data.stock,
          weight: this.props.route.params.data.weight,
          id: this.props.route.params.data.id,
        });
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
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }

  editProduct() {
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
        _method: 'PUT',
        name: name,
        description: description,
        category_id: category_id,
        price: price,
        weight: weight,
        stock: stock,
      };
      this.setState({loading: true});
      fetch(
        `http://si--amanah.herokuapp.com/api/product/${this.props.route.params.data.id}`,
        {
          method: 'POST',
          body: this.createFormData(photo, product),
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if (response) this.setState({loading: false});
          ToastAndroid.show('Produk telah disunting.', ToastAndroid.LONG);
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

  deleteProduct() {
    fetch(
      `http://si--amanah.herokuapp.com/api/product/${this.props.route.params.data.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.state.token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((json) => {
        const {status} = json;
        if (status == 'Success') {
          ToastAndroid.show('Produk telah dihapus.', ToastAndroid.LONG);
          this.props.navigation.replace('BottomTab', {screen: 'Profile'});
        } else {
          alert('Gagal menghapus');
        }
      })
      .catch((err) => console.log(err));
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

  alert() {
    Alert.alert(
      'Sukses',
      'Barang telah disunting.',
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
  }

  alert2() {
    Alert.alert(
      'Anda yakin?',
      'Barang akan dihapus dan tidak bisa diulang kembali.',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Iya',
          onPress: () => this.deleteProduct(),
        },
      ],
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/cartPurchase.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Edit Produk</Text>
        </View>
        <ScrollView>
          <View style={styles.input}>
            <Text>Nama Produk</Text>
            <TextInput
              value={this.state.name}
              placeholder="eg. Susu Kental Manis"
              onChangeText={(input) => this.setState({name: input})}
              style={styles.textInput}
            />
          </View>
          <TouchableOpacity
            style={styles.viewPP}
            onPress={() => this.handleEditPhoto()}>
            {this.state.photo == '' ? (
              <Image
                source={{uri: this.props.route.params.data.image}}
                style={styles.pp}
              />
            ) : (
              <Image source={this.state.photo} style={styles.pp} />
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
                    value={`${this.state.stock}`}
                    keyboardType={'number-pad'}
                    placeholder="eg. 50"
                    onChangeText={(input) => this.setState({stock: input})}
                    style={styles.textInput2}
                  />
                </View>
                <View>
                  <Text>Berat (KG)</Text>
                  <TextInput
                    value={`${this.state.weight}`}
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
              value={this.state.description}
              placeholder="eg. Semanis senyuman dia!"
              onChangeText={(input) => this.setState({description: input})}
              style={styles.textInput}
            />
            <Text>Harga</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 20}}>Rp.</Text>

              <TextInput
                value={`${this.state.price}`}
                keyboardType="number-pad"
                placeholder="eg. Rp.50.000,-"
                onChangeText={(input) => this.setState({price: input})}
                style={styles.textInput3}
              />
              <Text style={{fontSize: 20}}>,-</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginVertical: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.touchAbort}
              onPress={() =>
                this.props.navigation.replace('BottomTab', {screen: 'Profile'})
              }>
              <Text style={styles.text}> Batal </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.alert2()}>
              <Image
                source={require('../../assets/rubbish-bin-delete-button.png')}
                style={{width: 40, height: 40}}
              />
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
                onPress={() => this.editProduct()}>
                <Text style={styles.text}> Edit Produk </Text>
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
    width: '40%',
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
    borderRadius: 10,
  },
  touchEdit: {
    width: '40%',
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC5F1',
    borderRadius: 10,
  },
  touchEdit2: {
    width: 143.5,
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
  textInput3: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 40,
    marginBottom: 15,
    marginTop: 5,
  },
});

export default ProfileEdit;
