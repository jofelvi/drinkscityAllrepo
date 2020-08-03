import React from 'react';
import {Perfil as PerfilEmpresa} from '../classes/Perfil';

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
  Icon,
  Right,
  Left,
  Body,
  Fab,
  Tabs,
  Tab,
  Header,
  Thumbnail
} from 'native-base';

import {
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  Root,
  AsyncStorage
} from 'react-native';

import FontAwesome, {Icons} from 'react-native-fontawesome';
import Funcionario from '../classes/Funcionario';
import Connection from '../config/connection';
import { store } from '../redux/store';

var BackHandler = require('BackHandler')

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

export default class Funcionarios extends React.Component{

  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.evento.data.name}`,
    headerTintColor: "#ffffff",
    headerStyle: { backgroundColor: "#01DAC9" },
  });

  constructor(props){
    super(props);
    this.state = {
      products: [],
      tickets: []
    };
  }


  async componentDidMount(){
    this.setState({
      tickets: this.props.navigation.state.params.evento.data.tickets,
      products: this.props.navigation.state.params.evento.data.products,
    })
  }

  componentWillMount(){
    BackHandler.removeEventListener('hardwareBackPress', ()=> true);
    BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
  }

  onDelete(func){
     (new Funcionario(func)).delete();

     let objects = this.state.funcionarios.filter( data =>{
      return data.id !=  func.id
     } )
     this.setState({
      funcionarios: objects
     })
  }

  render(){
    const { width, height } = Dimensions.get('screen')


    return(
      <View style={styles.container}>
        <Tabs>
          <Tab 
            heading="Entradas" 
            tabStyle={{backgroundColor: "gray"}} 
            activeTabStyle={{backgroundColor: "#01DAC9"}}
            textStyle={{color: 'white'}}
            activeTextStyle={{color: 'white'}}
          >
            <ScrollView>
              <List dataArray={this.state.tickets}
                renderRow={(item) =>
                  <ListItem avatar>
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>{`Precio: $${(new Number(item.price)).formatMoney(2, '.', ',')} - Stock: ${item.stock}`}</Text>
                    </Body>
                    <Right>
                      <Text note>{`Desde: ${item.start_date.split('T')[0]}`}</Text>
                      <Text note>{`Hasta: ${item.end_date.split('T')[0]}`}</Text>
                    </Right>
                  </ListItem>
                }>
              </List>
            </ScrollView>
          </Tab>
          <Tab 
            heading="Productos"
            tabStyle={{backgroundColor: "gray"}} 
            activeTabStyle={{backgroundColor: "#01DAC9"}}
            textStyle={{color: 'white'}}
            activeTextStyle={{color: 'white'}}
          >
            <ScrollView>
              <List dataArray={this.state.products}
                renderRow={(item) =>
                  <ListItem thumbnail>
                    <Left>
                      <Thumbnail square source={{ uri: item.image }} />
                    </Left>
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>{`Precio: $${(new Number(item.price)).formatMoney(2, '.', ',')}`}</Text>
                    </Body>
                    <Right>
                      <Text note>{`Stock: ${item.stock}`}</Text>
                    </Right>
                  </ListItem>
                }>
              </List>
            </ScrollView>
          </Tab>
        </Tabs>
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