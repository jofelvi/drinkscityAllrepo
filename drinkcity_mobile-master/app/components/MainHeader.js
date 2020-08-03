import React from 'react';
import {
	View,
	Text,
	Thumbnail,
	Container,
	Content,
	H3,
	Button
} from 'native-base';

import {
	Image,
	Dimensions,
	TouchableOpacity,
	AsyncStorage,
	Alert,
	TouchableHighlight
} from 'react-native'
import Connection from '../config/connection';
import Model from '../classes/Model';
export default class MainHeader extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			user: {
				name: 'Cargando...',
				email: 'Cargando...'
				
			},
			store: null
		}
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		let {user, store} = await JSON.parse(session);

		let resp = Model.getWithId('stores', store.id);
		resp = await resp;
		resp = ( typeof(resp) == 'string' ) ? JSON.parse(resp) : resp;
		store = resp;
		this.setState({
			store,
			user:{
				...user
			}
		});

		//Alert.alert('DEBUG', JSON.stringify(this.state))

	}

	render(){
		const { width, height} = Dimensions.get('screen')
		const { navigation } = this.props
		let { user } = this.state;
		let { store } = this.state;
		var logo = require('../assets/img/logo_2.jpg')
		var portada = require('../assets/img/dc.jpg')
		if(store !== null){
			const con = new Connection();
			logo =  { uri: store.logo };
			let url = ( typeof(logo) == 'string' ) ? logo : JSON.stringify(logo);
			// Alert.alert('DEBUG', JSON.stringify(store.logo))
			if(store.images){
				let { images } = store;
				if(images.self.length > 0){
					let imgSrc = ( (store.images.self.length - 1) < 0 ) ? store.images.self[0] : store.images.self[ (store.images.self.length - 1) ];
					let url = imgSrc.cover_url;
					
					portada = { uri: url };
					//Alert.alert('URL', JSON.stringify(portada));
				}
			}
		}
		return(
			<View style={styles.header}>
				<TouchableHighlight 
					onPress={()=>{ navigation.navigate('portada') }}
					style={{width:width, height: 130}}
				>
				<Image 
					source={portada} 
					style={{
						maxHeight: 130,
						maxWidth:  width,
						flex: 1
					}}
				/>
				</TouchableHighlight>
				<TouchableOpacity 
					style={styles.imgLogo}  
					onPress={ ()=>{ navigation.navigate('PerfilScreen') } }
				>
					<Thumbnail 	
						style={{
							width: 85,
							height: 85,
							borderColor: "#01DAC9",
							borderWidth: 2.3
						}}
						square 
						source={logo} 
					/>
				</TouchableOpacity>
				<View style={styles.logo}>

					<H3 style={styles.logoText}>
						{ (store !== null) ? store.name : 'Cargando...' }
					</H3>
					<Text style={styles.logoTextP}>{user.email}</Text>

				</View>

			</View>
		);
	}

}

const styles = {
	header: {
		position: "relative",
		marginTop: 0,
		marginBottom: "-5%"
	},
	logo: {
		position: "relative",
		marginLeft: 138,
		marginTop: 2
	},
	logoText: {
		marginBottom: 0,
		marginTop: 5,
		paddingBottom: 10,
		color: "#ffffff",
		fontSize: 30

	},
	logoTextP:{
		marginTop: 0,
		fontSize: 12,
		color: "#ffffff"		
	},
	imgLogo:{
		position: "absolute",
		top: 94,
		left: 20,
		width: 200,
		height: 200
	}
}