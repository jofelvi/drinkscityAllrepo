import React from 'react';
import {
  Container,
  Content,
  View,
  Text,
  List,
  ListItem,
  Label,
  Fab,
  Button,
  Body,
  Left,
  Right,
  CardItem,
  Card,
  Col
} from 'native-base';

 
import {
  Dimensions,
  StatusBar,
  Alert,
  ScrollView,
  WebView,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';

import YouTube from 'react-native-youtube'
import { MenuProvider } from 'react-native-popup-menu';
import { PopMenu } from '../components/PopupMenu'

import FontAwesome, {Icons} from 'react-native-fontawesome';
import Connection from '../config/connection'
import Guest from '../classes/Guest';
import { store } from '../redux/store';

var BackHandler = require('BackHandler')

export default class Invitados extends React.Component{

  static navigationOptions = ({navigation}) => ({
    title: `MIS INVITADOS`,
    headerTintColor: "#ffffff",
    headerStyle: { backgroundColor: "#01DAC9" }
  })

  constructor(props){
    super(props);
    this.state = {
      active: false,
      store: null,
      event_id: null,
      invitados: []
    }

    store.subscribe( ()=> {
      let invitados = [];
      for (var i = 0 - 1; i <store.getState().invitados.length; i++) {
        invitados[i] = ( ! (store.getState().invitados[i] instanceof Guest) ) 
              ? new Guest(store.getState().invitados[i])
              : store.getState().invitados[i];
      }
      this.setState({
        invitados: invitados
      });
      //Alert.alert('DE', JSON.stringify(this.state.eventos[5].data.store))
    });

  }

  async componentDidMount(){
    let session = await AsyncStorage.getItem('@session');
    let { store } = await JSON.parse(session);
    let event_id = this.props.navigation.state.params.event_id
    this.setState({
      store,
      event_id
    });
    //Alert.alert('DEBUG', JSON.stringify(this.state.store));
  }

  componentWillMount(){
    BackHandler.removeEventListener('hardwareBackPress', ()=> true);
    BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
    let guest = new Guest();
    let event_id = this.props.navigation.state.params.event_id
    guest.getAllGuests(null, event_id);
  }

  _onUpdate = (data) =>{
    let events = this.state.invitados.map((event) =>{
      if(event.data.id == data.id)
        return new Event(data);
      return event;
    });

    this.setState({
      invitados: events
    });
  }

  _onUpdateButtonPress = (evento) => {

    this.props.navigation.navigate('FormEvent', { evento, priority: evento.data.priority, onUpdate: this._onUpdate })
  }

  _onDelete = ( evento ) =>{
    let events = this.state.invitados.filter((event, i)=>{
      return evento.data.id != event.data.id
    });

    this.setState({
      invitados: events
    });

    del = ( guest instanceof Guest ) ? guest : new Guest(guest);
    del.delete();

  }


  _renderList(){
    let con =new Connection();
    let { tipos } = this.state;
    let { store } = this.state;

      const items = this.state.invitados.map( (data, i)=> {
        // Alert.alert('data', JSON.stringify(data));    
        return(
          <Card key={i} style={{ width: "99%", borderColor: "#01DAC9", borderWidth: 1, backgroundColor: "#111111" }} >
            <CardItem style={{backgroundColor: "#111111"}}>
              <Left />
              <Body />
              <Right />

            </CardItem>
            <CardItem cardBody style={{backgroundColor: "#111111"}}>

            </CardItem>
            <CardItem style={{backgroundColor: "#111111"}}>
              <Col>
                <Text selectable={true} style={{color: "#ffffff",textAlign: "center", width: "100%", fontSize: 17,}}>
                  {data.data.name}
                </Text>
                <Text selectable={true} style={{color: "#ffffff",textAlign: "center", width: "100%", fontSize: 17,}}>
                  {data.data.email}
                </Text>
              </Col>
            </CardItem>
          </Card>
        );
      });
      return items;
    
  }

  render(){
    return(
      <MenuProvider>
      <View style={styles.container}>
        <StatusBar translucent={false} backgroundColor={'#02A6A4'} />
        <ScrollView>
          {this._renderList()}
        </ScrollView>
            <View style={{ flex: 1 }}>
              <Fab
                containerStyle={{ }}
                style={{ backgroundColor: '#02A6A4' }}
                position="bottomRight"
                onPress={() =>  this.props.navigation.navigate(`FormGuest`,{meth: 'POST', titulo: 'Listado de invitados', side: 'Home', event_id: this.state.event_id, event: false}) }>
                <Text style={{color:"#ffffff", fontSize: 20}}>
                  <FontAwesome style={{color:"#ffffff", fontSize: 20}}>{Icons.plus}</FontAwesome>
                </Text>
              </Fab>
            </View>
      </View>
      </MenuProvider>
    );
  }
}


const styles = {
  container: {
    backgroundColor: "#111111",
    flex: 1,
  }
}