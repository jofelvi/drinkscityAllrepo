import React from 'react';
import {
  Row,
  Grid,
  Container,
  Content,
  Col,
  Text,
  View,
  Input,
  Form,
  Item,
  Picker,
  Label,
  Button,
  Thumbnail
} from 'native-base';

import {
  Alert,
  TouchableOpacity,
  ScrollView,
  WebView,
  StatusBar,
  StyleSheet,
  AsyncStorage,
  PermissionsAndroid,
  Keyboard
} from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Guest from '../../classes/Guest';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Modal from "react-native-modal";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Cropper from '../../classes/Cropper';

import GooglePlacesInput from '../Autocomplete';

const moment = require('moment');

var ImagePicker = require('react-native-image-picker');
var options = {
  title: 'Selecciona una opción',
  takePhotoButtonTitle: 'Tomar desde la camara',
  chooseFromLibraryButtonTitle: 'Elegir una desde la galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class FormGuest extends React.Component{


  static navigationOptions = {
    title: 'ADICIONAR INVITADO',
    headerTintColor: "#ffffff",
    headerStyle: { backgroundColor: "#01DAC9" }
  }


  constructor(props){
    super(props);

    const { navigation } = this.props;

    let guest = new Guest({
            'name' : '', 
            'email' :'',
          });

    this.state = {
      ...guest.data,
      guest: guest,
      name: "",
      email: "",
      event_id: navigation.state.params.event_id,
      meth: 'POST',
      togleModal: false,
      statusBarColor: "#02A6A4",
      statusBarStyle: 'default'
    }
    this.componentWillMount()

  }

  async componentDidMount(){
    let session = await AsyncStorage.getItem('@session');
    session = await JSON.parse(session);
    let { store } = session;
    let event_id = this.props.navigation.state.params.event_id
    this.setState({
      event_id: this.state.guest.setAttribute('event_id', event_id)
    });
  }

  async componentWillMount(){

    let session = await AsyncStorage.getItem('@session');
    session = await JSON.parse(session);
    this.setState({
      stores: session.stores
    });
  }


  render(){

    return(
      <View style={styles.container}>
        <StatusBar translucent={false} backgroundColor={this.state.statusBarColor} />
        <ScrollView>
          <Content>
          <Form>
            <Grid>
            <Row>
              <Col style={{width: "95%"}}>
                <Item floatingLabel>
                  <Label 
                    style={{ color: "#ffffff" }} >Nombre
                  </Label>
                  <Input 
                    style={{ color: "#ffffff" }} 
                    onChangeText={ text =>{this.state.guest.setAttribute('name',text); this.setState({name: text}) }} 
                    value={this.state.name}
                  />
                </Item>
                <Item floatingLabel>
                  <Label 
                    style={{ color: "#ffffff" }} >Correo
                  </Label>
                  <Input 
                    style={{ color: "#ffffff" }} 
                    onChangeText={ text =>{this.state.guest.setAttribute('email',text); this.setState({email: text}) }} 
                    value={this.state.email}
                  />
                </Item>
              </Col>
            </Row>
            </Grid>
          </Form>
          </Content>

          <Button onPress={()=>{ 
            if(this.state.meth == 'PUT')
              this.state.guest.update('PATCH','guest', this.state.id ,this.props.navigation)
            else{
              this.state.guest.push(this.props.navigation, 'POST'); 
            }
          }}  block style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}>
            <Text style={{color: "#ffffff"}}>INVITAR</Text>
          </Button>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#111111",
    flex: 1,
  },
    containerMap: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: "10%"
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
}