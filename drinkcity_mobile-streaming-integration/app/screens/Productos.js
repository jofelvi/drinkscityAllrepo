import React from 'react';

import { 
	Container,
	Content,
	Grid,
	Row,
	Col,
	Text,
	Card,
	CardItem,
	Body,
	View,
	Thumbnail,
	H2,
	Spinner,
	H3,
	Left,
	Button,
	Right
} from 'native-base';
import { 
	Alert,
	Dimensions,
	StatusBar,
	Image,
	TouchableOpacity,
	AsyncStorage,
	ScrollView,
	TouchableHighlight
} from 'react-native';

import Product from '../classes/Product'
import { store } from '../redux/store';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Connection from '../config/connection';

import { MenuProvider } from 'react-native-popup-menu';
import { PopMenu } from '../components/PopupMenu'
const moment = require('moment')
import BackHandler from 'BackHandler';

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

export default class Productos extends React.Component{

	static navigationOptions = {
		title: 'MIS PRODUCTOS',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}

	constructor(props){
		super(props);
		this.state = {
			products: []
		};
	}

	async componentWillMount(){
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
				if(_bodyInit.products.length == 0){
					this.setState({
						products: null
					})
				}
				else{
					this.setState({
						products: _bodyInit.products
					})
				}
				
			}
		});
	}

	_loadUrlImageResource(toLoad){
		var url ='';
		if( toLoad.images !== undefined ){
			if( Array.isArray(toLoad.images.self) && toLoad.images.self.length > 0 ){
				url = toLoad.images.self[0].cover_url;
				
			}
		}
		// else url = con.getProtocol()+'//'+con.getOnlyUrl()+toLoad.image;
		else url = toLoad.image;
		return url;
	}

	_onUpdate = (data) =>{
		let events = this.state.products.map((event) =>{
			if(event.data.id == data.id)
				return new Product(data);
			return event;
		});

		this.setState({
			products: products
		});
	}

	_onUpdatePress = (producto) =>{
		//Alert.alert('DEBUG-PRODUCTOS',JSON.stringify(producto));
		this.props.navigation.navigate('Estandar', {from: 'Productos' ,producto: new Product(producto), titulo: 'Editar producto', priority: producto.priority })
	}

	_onDelete = (dato) =>{

		let events = this.state.products.filter((producto, i)=>{
			return producto.id != dato.id
		});

		this.setState({
			products: events
		})
		
		del = ( dato instanceof Product ) ? dato : new Product(dato);
		del.delete();
		return true;
	}



	_renderCol(dato, i){
		dato = ( dato instanceof Product ) ? dato : new Product(dato);
		let day = moment(dato.data.created_at).format('DD-MM-YYYY');
		return(
			<TouchableHighlight key={i} onPress={()=>{ this.props.navigation.navigate('PorProducto', { titulo: 'EDITAR: '+dato.data.name, product: dato.data, onDelete: this._onDelete }) }}>
			<Col style={{width: "100%"}}>
				<Card style={{flex: 0}}>
					<CardItem cardBody>
						<Image
							source={{uri:  this._loadUrlImageResource(dato.data)}}
							style={{height: 300, width: "100%", flex: 0  }}
						/>
					</CardItem>
					<CardItem footer>
						<Col style={{ width: "100%", alignContent: "center", justifyContent: "center", alignSelf: "center" }}>
							<Text selectable={true} style={{textAlign: "center", width: "100%", fontSize: 21, fontWeight: 'bold'}}>
								{dato.data.name}
							</Text>
							<Text selectable={true} style={{textAlign: "center", width: "100%", fontSize: 15,}}>
								$ {(new Number(dato.data.price)).formatMoney(2, '.', ',')} # {dato.data.stock}
							</Text>
						</Col>

					</CardItem>
				</Card>
			</Col>
			</TouchableHighlight>
		);
	}

	_renderCards(){
		let { products } = this.state;
		if( products !== null ){
			if( products.length >0){
				const cards = products.map( ( dato, i ) =>{

					return this._renderCol( dato, i )
				});
				return cards;
			}
		}
		else if(products == null){
			Alert.alert('Advertencia', 'No se han encontrado productos relacionados a esta tienda');
		}
		else{
			const cards2 = <Spinner color={'#02A6A4'} />
			return cards2;
		}

		
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		
		return(
			<MenuProvider>
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<Content style={styles.container}>
					{this._renderCards()}
				</Content>
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