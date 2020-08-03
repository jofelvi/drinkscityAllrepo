import React from 'react';
import {
	View,
	Container,
	Content,
	Grid,
	Row,
	Col,
	H2,
	Spinner,
	List,
	ListItem,
	Text,
	Right,
	Left,
	Body
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	AsyncStorage,
	ScrollView
} from 'react-native';

import {
	Thumbnail,
	Button
} from 'native-base'

import Connection from '../config/connection';
import Model from '../classes/Model'
import BackHandler from 'BackHandler';

export default class onQRScann extends React.Component{

	static navigationOptions = {
		title: 'Verificacion de orden',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}


	constructor(props){
		super(props);
		this.state = {
			user: null,
			order: null,
			load: true
		}
	}

	async componentWillMount(){
		let user = {};
		let order = {};
		const { navigation } = this.props;
		const { scanData } = navigation.state.params

		order = await Model.getWithId('orders', scanData.data).then( resp => JSON.parse(resp) );
		if( order != null && order != undefined )
		{
			this.setState({ load: false });

			this.setState({
				order: order
			});
		}
	}

	componentDidMount(){

	    BackHandler.removeEventListener('hardwareBackPress', ()=> true);
	    BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	    
	}

	_resumenOrder(){
		if(this.state.order != null){
			return (
				<View>
					<View style={{alignSelf: "center"}}>
					</View>
					<View style={{alignSelf: "center"}}>
						<H2 style={{color: "#ffffff", fontSize: 14, fontWeight: 'bold'}}>SUB TOTAL: .... {this.state.order.subtotal}</H2>
					</View>
				</View>
			);
		}

		return (
			<View style={{alignSelf: "center"}}>
				<Spinner color={"#02A6A4"} />
				<H2
					style={{color:"#ffffff", fontSize: 13}}>
					Buscando ...
				</H2>
			</View>
		);
	}

	async _validate(order){
		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);

		const body = '{"id": '+order.id+', "validator_id": '+token.user.id+' }';
		

		con = new Connection();
		let resp = await fetch( con.getUrlApi('orders/validate_order'), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token.token,
				Accept: 'json'
			},
			body: body
		}).then( resp =>{
			if(resp.status == 200 || resp.status == '200'){
				Alert.alert('Correcto', 'La orden ha sido correctamente validada', [
					{
						text: "Aceptar",
						onPress:()=>{ this.props.navigation.goBack() }	
					}
				]);
			}

		});
	}

	validateOrder(){
		let { order } = this.state;
		if( order.order_status_id != 3 || order.order_status_id != '3' ){
			Alert.alert('Error', 'Entrada y/o productos ya canjeados');
			return false;
		}

		
		Alert.alert('Advertencia', '¿Seguro que desea realizar esta accion?', [
			{
				text: 'Aceptar',
				onPress:()=>{
					this._validate(order);
				}
			},
			{
				text: "Cancelar"
			}
		]);
		
	}

	_renderResumenOrderItems(){
		let { order } = this.state;
 
		if( order  != null ){
				let itemsList = order.order_items.order_items.map( (item, i)=>{
					return(
						<ListItem style={{borderBottomWidth: 0}} avatar noBorder>
							<Left style={{borderBottomWidth: 0}}>
								<Text style={{color: "#ffffff"}}>
									({item.quantity})
								</Text>
							</Left>
							<Body style={{borderBottomWidth: 0}}>
								<Text style={{color: "#ffffff"}}>
									 {item.name}
								</Text>
								<Text note>
									$ {item.unit_price}
								</Text>
							</Body>
							<Right style={{borderBottomWidth: 0}} />
						</ListItem>
					);
				});

				return itemsList;
		}

		return null;
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<View>
					<View>
						<TouchableOpacity style={{marginTop: 17, alignSelf: "center", alignContent: "center",alignItems: "center"}}>
							<Image
								source={require('../assets/img/drinkscity_logo.png')}
								style={{
									width: 95,
									height: 100
								}}
							/>
						</TouchableOpacity>
					</View>
					<View style={{marginTop: "14%"}}>
						<Button disabled={this.state.load} onPress={()=>{this.validateOrder()}}  rounded full danger>
							<Text style={{color: "#ffffff"}}>{ (this.state.load) ? 'Cargando datos ...' : 'Validar'}</Text>
						</Button>
					</View>
					<View>
						<List>
						{this._renderResumenOrderItems()}
						</List>
					</View>
				</View>
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