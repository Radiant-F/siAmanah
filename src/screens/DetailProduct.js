import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  ScrollViewComponent,
} from 'react-native';
import {ScrollPager} from 'react-native-tab-view';

export class DetailProduct extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: '',
    };
  }

  componentDidMount() {
    fetch(
      `http://jsonplaceholder.typicode.com/posts/${this.props.route.params.id}`,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        });
        console.log(responseJson);
      });
    //   .catch((err) => console.log(err));
    // AsyncStorage.getItem('token')
    //   .then((token) => {
    //     if (token !== null) {
    //       this.setState({token: token});
    //     } else {
    //       alert('Token hilang!');
    //     }
    //   })
    //   .then(() => this.getItem());
    // }
  }

  getItem() {
    fetch(
      `http://restful-api-laravel-7.herokuapp.com/api/todo/${this.props.route.params.id}`,
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
        JSON.stringify(responseJson);
        if (responseJson != null) {
          console.log(responseJson);
          this.setState({
            isLoading: false,
            dataSource: responseJson,
          });
        } else {
          alert('error');
          console.log(responseJson);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _renderItem = ({item, index}) => {
    return (
      <View>
        <Image
          source={require('../assets/elektronikHeadset.jpg')}
          style={styles.image}
        />
        <View style={styles.viewTextProduct}>
          <Text style={styles.textProduct}>{item.title}</Text>
          <Text style={styles.textPrice}>Rp.50.000,-</Text>
          <Text style={styles.textDesc}>Mantep cuy</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.headerView}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../assets/go-back-left-arrow.png')}
                style={styles.headerIconBack}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>{this.state.dataSource.title}</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Cart')}>
              <Image
                source={require('../assets/shopping-cart.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={require('../assets/elektronikHeadset.jpg')}
            style={styles.image}
          />
          <View style={styles.items}>
            <View style={styles.viewTextProduct}>
              <Text style={styles.textProduct}>
                {this.state.dataSource.title}
              </Text>
              <Text style={styles.textPrice}>Rp.50.000,-</Text>
              <View style={styles.viewPurchase}>
                <TouchableOpacity style={styles.chatSeller}>
                  <Text style={styles.textChatSeller}>Chat Penjual</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../assets/cartPurchase.png')}
                    style={styles.cartImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.purchaseNow}>
                  <Text style={styles.textPurchase}>Beli Sekarang!</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.textDesc}>{this.state.dataSource.body}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
    flex: 1,
  },
  headerView: {
    backgroundColor: '#50c6f1',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  headerIcon: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  headerIconBack: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  items: {
    marginTop: -30,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 355,
  },
  viewPurchase: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 15,
    width: '100%',
  },
  cartImage: {
    width: 40,
    height: 42,
    tintColor: '#22a800',
  },
  viewTextProduct: {
    alignSelf: 'flex-start',
  },
  textProduct: {
    marginVertical: 5,
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  textPrice: {
    color: '#22a800',
    fontSize: 25,
  },
  textDesc: {},
  chatSeller: {
    width: 150,
    height: 50,
    backgroundColor: '#62d0f8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChatSeller: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
  purchaseNow: {
    width: 150,
    height: 50,
    backgroundColor: '#f5a300',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPurchase: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
});

export default DetailProduct;
