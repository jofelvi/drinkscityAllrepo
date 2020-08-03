import React, { Component } from 'react';
import {
	View,
	Text,
	Container,
	Content,
	Thumbnail
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Image,
	AsyncStorage,
	Alert
} from 'react-native';

import MainHeader from '../components/MainHeader';
import Botonera from '../components/Botonera';
import Connection from '../config/connection'
var BackHandler = require('BackHandler');


export default class Home extends Component {

	constructor(props){
		super(props);
		this.state={
			store: null
		}
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);

		this.setState({
			store: session.store
		});
	}

	componentDidMount(){
		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}


	async close(){

		Alert.alert('Advertencia', '¿Seguro de que desea salir de su cuenta?', [
			{
				text: "Aceptar",
				onPress: ()=>{
					try{
						AsyncStorage.removeItem("@session")
						.then( ()=>{
							this.props.navigation.navigate('RootScreen')
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
				<StatusBar translucent={false} backgroundColor={'#000000'}/>
				<MainHeader {...this.props} />
				<Content style={{ flex: 1}}>
					<Botonera  {...this.props} />
				</Content>
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