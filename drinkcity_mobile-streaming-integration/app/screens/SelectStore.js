import React, { Component } from 'react';
import {
	Container,
	Content,
	List,
	ListItem,
	Text,
	Body,
	View,
	Right,
	Fab,
	Row,
	Col
} from 'native-base';
import {
	TouchableOpacity,
	Dimensions,
	StatusBar,
	AsyncStorage,
	Alert
} from 'react-native';
import Connection from '../config/connection';
import FontAwesome, {Icons} from 'react-native-fontawesome';

var BackHandler = require('BackHandler');
export default class SelectStore extends Component{

	constructor(props){
		super(props);
		this.state = {
			stores: [],
			user: null
		};
		this.useStore.bind(this)
	}

	async getSucursales(){
		let session = await AsyncStorage.getItem('@session');
		const {token ,user} = await JSON.parse(session) || null;
		this.setState({
			user
		});
		let con = new Connection();
		fetch(con.getUrlApi('users')+'/'+user.id, {
			method: 'GET',
			headers: {
				Accept: 'json',
				Authorization: token
			}
		}).then(data=>{
			let { _bodyInit } = ( typeof(data) == 'string' ) ? JSON.parse(data) : data;
			_bodyInit = ( typeof(_bodyInit) == 'string' ) ? JSON.parse(_bodyInit): _bodyInit;
			if(_bodyInit.role == 'store_admin' || _bodyInit.role == 'rrpp'){
				if(_bodyInit.stores.length == 0){
					this.props.navigation.navigate('RegisterScreen', {user: user});
					return false;
				}else{

					stores = _bodyInit.stores
					let session = {
						token,
						user,
						stores
					};
					AsyncStorage.setItem('@session', JSON.stringify(session));
					this.setState({
						stores:_bodyInit.stores
					});
					//Alert.alert('BODY', JSON.stringify(this.state.stores));
				}
			}

		});

	}

	componentWillMount(){	
		this.getSucursales()
	}

	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', ()=>{
			return true;
		});
	}

	async useStore(store){
		let session = await AsyncStorage.getItem('@session');
		session = JSON.parse(session);
		session['store'] = store;
		AsyncStorage.setItem('@session', JSON.stringify(session));
		this.props.navigation.navigate('HomeScreen');
	}

	renderSucursales(){
		let { stores } = this.state;

		let item = stores.map( (store, i) =>{
			return( 
				<ListItem key={i} >
					<Body>
						<TouchableOpacity onPress={()=>{  this.useStore(store) }}>
						<Text note style={{color: "#ffffff"}}>{store.name}</Text>
						</TouchableOpacity>
					</Body>
					<Right>
						<TouchableOpacity onPress={()=>{  this.useStore(store) }}>
							<Text style={{color: "#ffffff"}}>
								<FontAwesome style={{color: "#ffffff", fontSize: 22}}>
									{Icons.angleRight}
								</FontAwesome>
							</Text>
						</TouchableOpacity>
					</Right>
				</ListItem>
			);
		}) ;

		return item;
	}

	async close(){

		Alert.alert('Advertencia', '¿Seguro de que desea salir de su cuenta?', [
			{
				text: "Aceptar",
				onPress: ()=>{
					try{
						AsyncStorage.removeItem("@session")
						.then( ()=>{
							this.props.navigation.navigate('RootScreen');
						} );
					}catch( err ){
						console.log(err)
					}
				}	
			},
			{
				text: "Cancelar"
			}
		]);

	}
	render(){
		const { width, height } = Dimensions.get('screen')
		return(
				
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'}/>
				<Content>
					<Row>
						<Col style={{width: "95%"}}>
							<List>
								{this.renderSucursales()}
							</List>
						</Col>
					</Row>
				</Content>

				{
					this.state.user && this.state.user.role == 'store_admin' &&
					<View style={{ flex: 1 }}>
		        <Fab
		          containerStyle={{ }}
		          style={{ backgroundColor: '#02A6A4' }}
		          position="bottomRight"
		          onPress={() =>  this.props.navigation.navigate(`RegisterScreen`, { user: this.state.user }) }>
		          <Text style={{color:"#ffffff", fontSize: 20}}>
		          	<FontAwesome style={{color:"#ffffff", fontSize: 20}}>{Icons.plus}</FontAwesome>
		          </Text>
		        </Fab>
		    	</View>
	    	}

				<View style={{ alignSelf: "center",alignContent: "center", alignItems: "center", flex: 0.1, left: 0, right: 0 ,position: "relative", bottom: 0, flexDirection: 'row', alignItems: "center" ,marginBottom : 0}}>
					<View style={{flex: 0.8, alignSelf: "center",alignContent: "center", alignItems: "center"}}>
						<TouchableOpacity onPress={()=>{this.close()}}>
							<Text style={{color: "#ffffff"}} > CERRAR SESION</Text>
						</TouchableOpacity>
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