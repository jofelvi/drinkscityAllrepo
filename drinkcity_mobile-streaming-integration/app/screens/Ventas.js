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
	Thumbnail
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView,
	TouchableHighlight,
	AsyncStorage
} from 'react-native';

import Product from '../classes/Product';
import Model from '../classes/Model';
import { store } from '../redux/store';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Connection from '../config/connection';

import MainHeader from '../components/MainHeader';

const moment = require('moment')
var BackHandler = require('BackHandler');

export default class Ventas extends Component{
	
	static navigationOptions = {
		title: 'MIS VENTAS',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}

	constructor(props){
		super(props);
		this.state = {
			products: [],
			pagadas: 0,
			validadas: 0,
			total: 0
		}

	}

	async loadProducts(products = undefined ){
		if(typeof(products) == 'object' && products !== undefined){
			let orders = await Model.getWithId('orders', null,this.props.navigation);
			let existing_products = products;

			orders = ( typeof(orders) == 'string' ) 
					? JSON.parse(orders) 
					: orders;

			this.toState(orders, 'orders');

			let products2 = [];

			products.map((product, i)=>{
				products2[product.id] = product;
				products2[product.id].validates = 0;
			});


			this.toState(products2, "products");

			this.calculate();
		}
	}

	toState( data = [], state = 'products' ){
		eval(`
			this.setState({
				${state}: data
			})
		`);
	}

	calculate(){
		var { products, orders } = this.state;
		var countPerItem = [];
		///Alert.alert('ORDERS', JSON.stringify(orders))
		orders.map( (order, i)=>{

			if(order.order_status_id == 4){
				this.setState({ validadas: ( this.state.validadas + 1 ) });
		
				order.order_items.order_items.map( (item)=>{
					products[item.product_id].validates = ( products[item.product_id].validates  + 1);
				});

				this.setState({
					products: products
				});
			}
			
		});
	}

	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}

	async componentDidMount(){
		let session = await AsyncStorage.getItem('@session');
		let { user, store, token } = JSON.parse(session);
		const con = new Connection();

		let resp = fetch( con.getUrlApi('stores/'+store.id), {
			method: 'GET',
			headers: {
				'Accept': 'json',
				Authorization: token.token
			}
		} ).then( resp =>{
			if(resp.status == 200 || resp.status == '200'){
				let _bodyInit = JSON.parse(resp._bodyInit);
				this.setState({
					products: _bodyInit.products
				});
				this.loadProducts(this.state.products);
				
			}
		});
	}


	_renderList(){
		const { products, validadas } = this.state;
		let item = null;
		if(products.length > 0){
			item = products.map((product, i)=>{
				if(product !== null){
					return(
						<ListItem>
							<Left>
								<TouchableOpacity onPress={ ()=>{ this.props.navigation.navigate('Detalles', { product, orders: this.state.orders }) } }>
									<Text style={{color :"#ffffff", textAlign: "center"}}>
										{product.name}
									</Text>
								</TouchableOpacity>
							</Left>
							<Body/>
							<Right>
								<Text style={{color: "#ffffff", textAlign: "center"}} >
									Total
								</Text>
								<Text style={{color: "#ffffff", textAlign: "center"}} >
								 	{product.validates}
								</Text>
							</Right>
						</ListItem>
					);
				}
			});
		}
		return item;
	}

	render(){
		const { width } = Dimensions.get('window')
		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
					<Grid>
						<Row>
							<Col style={{alignSelf: "center", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
								<TouchableOpacity 
									style={{
										backgroundColor: "#4B8DFE", 
										borderRadius: 64,
										width: 42,
										height: 42,
										paddingTop: 6
									}} 
								>
									<Text 
										style={{
											fontSize: 25,
											textAlign: "center",
											color: "#ffffff"
										}}
									>
										0
									</Text>
								</TouchableOpacity>
								<Text style={{color: "#ffffff"}}>
									Pagadas
								</Text>
							</Col>
							<Col>
								<TouchableHighlight style={{alignSelf: "center", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
								<Thumbnail
									source={require('../assets/img/icon.png')}
									style={{
										width: 120,
										height: 120
									}}

								/>
								</TouchableHighlight>
							</Col>
							<Col style={{alignSelf: "center", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
								<TouchableOpacity 
									style={{
										backgroundColor: "#01DAC7", 
										borderRadius: 64,
										width: 42,
										height: 42,
										paddingTop: 6
									}} 
								>
									<Text 
										style={{
											fontSize: 25,
											textAlign: "center",
											color: "#ffffff"
										}}
									>
										{this.state.validadas}
									</Text>
								</TouchableOpacity>
								<Text style={{color: "#ffffff"}}>
									Validadas
								</Text>
							</Col>
							

						</Row>
						<Row>
							<Col>
								<ScrollView>
									<List>
										{this._renderList()}
									</List>
								
								<Button style={{backgroundColor: "#01DAC9"}} block onPress={()=>{this.props.navigation.navigate('GraphicsScreen', { products: this.state.products, orders: this.state.orders } )}}>
									<Text>
										Graficos
									</Text>
								</Button>
								</ScrollView>
							</Col>
						</Row>
					</Grid>
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