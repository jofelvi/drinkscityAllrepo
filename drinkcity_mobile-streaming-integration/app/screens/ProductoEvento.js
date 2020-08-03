import React from 'react';

import {
  View,
  Container,
  Content,
  Button,
  Text,
  Form,
  Item,
  Input,
  Label,
  List,
  ListItem,
  Picker,
  Grid,
  Row,
  Col,
  Left,
  Right,
  Body,
  Thumbnail
} from 'native-base';

import {
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  AsyncStorage,
  Keyboard
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import Publicacion from '../classes/Publicacion';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Ticket from '../classes/Ticket'
import Cropper from '../classes/Cropper';
import Connection from '../config/connection'
var ImagePicker = require('react-native-image-picker');
import DateTimePicker from 'react-native-modal-datetime-picker';


var BackHandler = require('BackHandler')
const moment = require ('moment');

var options = {
  title: 'Cargar imagenes',
  takePhotoButtonTitle: 'Tomar desde la camara',
  chooseFromLibraryButtonTitle: 'Elegir una desde la galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class ProductoEvento extends React.Component{


  static navigationOptions = ({navigation}) => ({
    title: `PRODUCTO EVENTO`,
    headerTintColor: "#ffffff",
    headerStyle: { backgroundColor: "#01DAC9" },
  });


  constructor(props){
    super(props);
    pub = new Ticket();
    this.state = {
      stores: [],
      products: [],
      selectedItems: [],
      pub,
      type: '',
      con: new Connection(),
      showPicker: false,
      event: null,
      savePress: false,
    };

  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems: this.state.pub.setAttribute('users', selectedItems)});
  };

  async saveTicket(){
    alert("Work in progress ...")
    // let con = new Connection();
    // let { event } = this.props.navigation.state.params;
    // let session = await AsyncStorage.getItem('@session');
    // let { token } = await JSON.parse(session);

    // // let body= `{ "ticket": { "name": "${this.state.name}", "start_date": "${this.state.start_date}", "end_date": "${this.state.end_date}", "price": ${this.state.price}, "stock": ${this.state.stock}, "event_id": ${event.data.id}, "users": ${JSON.stringify(this.state.selectedItems)} } } `;
    // let body = {
    //   ticket: {
    //     name: this.state.name,
    //     start_date: this.state.start_date,
    //     end_date: this.state.end_date,
    //     price: this.state.price,
    //     stock: this.state.stock,
    //     event_id: event.data.id,
    //     users: this.state.selectedItems
    //   }
    // }
    // let request =await fetch( con.getUrlApi('tickets'), {
    //   method: 'POST',
    //   headers: {
    //     Authorization:token.token,
    //     'Content-Type': 'application/json',
    //     Accept: 'json'
    //   },
    //   body: JSON.stringify(body)
    // } ).then(resp => {
    //   if(resp.status == 200 || resp.status== '200' || resp.status == 201 || resp.status == '201'){
    //     Alert.alert('Confirmacion', 'La entrada ha sido creada de manera correcta',[
    //       {
    //         text: 'Aceptar',
    //         onPress: ()=>{ this.props.navigation.goBack(); }
    //       }
    //     ]);
    //   }
    // });
    // this.setState({
    //   savePress: false
    // });
  }

  async componentWillMount(){
    let session = await AsyncStorage.getItem('@session');
    session = await JSON.parse(session);
    let { state } = this.props.navigation
    this.setState({
      event: state.params.event
    });
    // Alert.alert('D-2', JSON.stringify(state.params.event.data))
  }


  async componentDidMount(){

    BackHandler.removeEventListener('hardwareBackPress', ()=> true);
    BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
    let session = await AsyncStorage.getItem('@session');
    let { token } = await JSON.parse(session);
    session = await JSON.parse(session);
    let { store } = session;

    let con = new Connection();
    let resp = await fetch( con.getUrlApi('event_products/'+store.id), {
      headers:{
        method: 'GET',
        'Content-Type': 'application/json',
        Accept: 'json',
        Authorization: token.token
      }
    } ).then( resp => {

      if(resp.status == 200 || resp.status == '200'){
        let _bodyInit = JSON.parse(resp._bodyInit);
        // let { users } = _bodyInit;
        this.setState({
          products: _bodyInit
        });
        // Alert.alert('DEBUG', JSON.stringify(_bodyInit))
      }

    });
    
  }

  async addProductToEvent(product){
    let session = await AsyncStorage.getItem('@session');
    let { token } = await JSON.parse(session);
    // session = await JSON.parse(session);
    // let { store } = session;

    let con = new Connection();
    let resp = await fetch( con.getUrlApi('add_products_event'), {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'json',
        'Authorization': token.token
      },
      body: JSON.stringify({
        event_id: this.state.event.data.id,
        product_id: product.id
      }),
    } ).then( resp => {

      if(resp.status == 200 || resp.status == '200'){
        let _bodyInit = JSON.parse(resp._bodyInit);
        // let { users } = _bodyInit;
        this.setState({
          products: this.state.products.filter( item => item.id !== _bodyInit.product_id)
        });
        // Alert.alert('DEBUG', JSON.stringify(_bodyInit))
      }

    });    
  }

  render(){
    const { selectedItems } = this.state;
    return(
      <View style={styles.container}>
        <Content style={{backgroundColor: '#111111'}}>
          <List dataArray={this.state.products}
            renderRow={(item) =>
              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={{ uri: item.image }} />
                </Left>
                <Body>
                  <Text style={{color: 'white'}}>{item.name}</Text>
                  <Text note numberOfLines={1}></Text>
                </Body>
                <Right>
                  <Button transparent onPress={() => this.addProductToEvent(item)}>
                    <Text>Adicionar</Text>
                  </Button>
                </Right>
              </ListItem>
            }>
          </List>
        </Content>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#111111",
    flex: 1,
  }
}