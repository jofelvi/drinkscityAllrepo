import React, { Component } from 'react';
import {
	View,
	Container,
	Content,
	Button,
	Text,
	Col,
	Row,
	Grid,
	List,
	ListItem,
	Body,
	Right,
	Left,
	H2,
	Thumbnail,
	Card,
	CardItem
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView,
	TouchableHighlight,
	Image
} from 'react-native';

import Product from '../classes/Product';
import Model from '../classes/Model';
import { store } from '../redux/store';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import MainHeader from '../components/MainHeader';
import Connection from '../config/connection';

const moment = require('moment')
var BackHandler = require('BackHandler');

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
export default class PorProducto extends Component{
	
	static navigationOptions = ({navigation})=>({
		title: `${navigation.state.params.product.name}`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	})

	constructor(props){
		super(props);
		this.state = {
			products: [],
			pagadas: 0,
			validadas: 0,
			total: 0
		}

		let { state } = this.props.navigation;
	}

	onDelete(){
		let { state } = this.props.navigation;
		Alert.alert('Advertencia', '¿Esta seguro de que desea realizar esta accion?', [
			{
				text: 'Aceptar',
				onPress:()=>{ 
					if(state.params.onDelete(state.params.product)){
						Alert.alert('Accion realizada', 'La accion se ha realizado correctamente', [
							{
								text: 'Aceptar',
								onPress:()=>{ this.props.navigation.navigate('Productos'); }
							}
						]);
					}

				}	
			},
			{
				text: 'Cancelar'
			}
		]);
	}


	render(){
		const { width } = Dimensions.get('window');
		let { product } = this.props.navigation.state.params;
		const con = new Connection();
		
		// Alert.alert('producto', JSON.stringify(product))
		let ImageUrl = ( product.image !== undefined ) ? product.image : product.images.self[0].cover_url;
		
		//Alert.alert('debug',JSON.stringify(this.props.navigation.state.params.product))
		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<Card style={{flex: 0}}>
					<CardItem cardBody>
						<Image
							source={{uri:  ImageUrl}}
							style={{ height: 300, width: "100%", flex: 1 }}
						/>
						<View style={{flex:1, position:'absolute', right: 0}}>
							<Button rounded danger onPress={()=>{ this.onDelete(); }}>
									<FontAwesome style={{color:"#ffffff", fontSize: 22}}>{Icons.close}</FontAwesome>
							</Button>
							<Button onPress={()=>{ this.props.navigation.navigate('Estandar', {producto: product, from: 'Productos'}) }} rounded style={{backgroundColor: '#01DAC9', marginTop: 10}}>
									<FontAwesome style={{color:"#ffffff", fontSize: 22}}>{Icons.pencil}</FontAwesome>
							</Button>
						</View>
					</CardItem>
					<CardItem footer>
						<Col style={{ width: "100%" }}>
							<Text selectable={true} style={{width: "100%"}}>
								Producto: {product.name}
							</Text>
							<Text selectable={true} style={{width: "100%", fontSize: 15,}}>
								Fecha desde: { moment(product.start_datetime, 'DD-MM-YYYY').format('DD-MM-YYYY') } Hasta: { moment(product.end_datetime, 'DD-MM-YYYY').format('DD-MM-YYYY') }
								{'\n'}
								Descripcion: { product.description }
								{'\n'}
								Valor: $ {(new Number(product.price)).formatMoney(2, '.', ',')}
							</Text>
						</Col>
					</CardItem>
				</Card>
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