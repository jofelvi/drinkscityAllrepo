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
	Right,
	Fab
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
import Model from '../classes/Model';

import { MenuProvider } from 'react-native-popup-menu';
import { PopMenu } from '../components/PopupMenu'
const moment = require('moment')
import BackHandler from 'BackHandler';


import Cropper from '../classes/Cropper';

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

export default class Portada extends React.Component{

	static navigationOptions = {
		title: 'Actualizar banner',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}

	constructor(props){
		super(props);
		this.state = {
			store: null,
			con: new Connection(),
			nueva_imagen: null,
			onSavePress: false
		};
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		let { store } = await JSON.parse(session);
		let resp = Model.getWithId('stores', store.id);
		let data = await resp;
		data = ( typeof(data) == 'string' ) ? JSON.parse(data): data;
		this.setState({
			store: data,
			nueva_imagen: null
		})
	}
	async takePhoto(){
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = { uri: response.uri };
				let format = {
					filename: response.fileName,
					content: response.data,
					content_type: 'image/jpeg'
				};
				let image = this.state.images;
				const crop = new Cropper();
				//image[ (image.length) ] = 'data:image/jpeg;base64,' +  response.data
				const { width, height } = Dimensions.get('screen');
				let b64Crop = crop.cropping(response.path, 2600, 840);

				setTimeout(()=>{
						this.setState(prevState=>{
							image = 'data:image/jpeg;base64,'+b64Crop._55.data;
							prevState.nueva_imagen = new Array(image);
							return prevState;
						});
					//Alert.alert('IMAGEN', JSON.stringify(this.state));
				}, 3000)
				 
				
				
			}
			
		});
	}

	async save(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		let { token, user, store } = session;
		let { con } = this.state;

		let url = con.getUrlApi('stores')+'/'+store.id;
		let body = `{"store": {"images":["${this.state.nueva_imagen[0]}"] } }`;
		let resp = fetch( url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'json',
				Authorization: token.token
			},
			body
		}).then( data =>{
			store = {
				...store,
				images: null
			}

			store.images = {
				self: new Array(this.state.nueva_imagen[0])
			}

			session = {
				...session,
				store
			}
			//Alert.alert('DEBUG', JSON.stringify(session));
			AsyncStorage.setItem('@session', JSON.stringify(session))
			Alert.alert('Notificacion', 'Los cambios han sido guardados satisfactoriamente', [
				{
					text:'Aceptar',
					onPress: ()=>{ this.props.navigation.navigate('HomeScreen') }	
				}
			]);
		});
	}

	renderFabIcon(){
		let iconFab = (
			<Text style={{color:"#ffffff", fontSize: 20}}>
			     <FontAwesome style={{color:"#ffffff", fontSize: 20}}>{Icons.check}</FontAwesome>
			</Text>
		);

		if(this.state.onSavePress){
			iconFab =  <Spinner color={'#FFFFFF'} />
		}

		return iconFab;
	}

	render(){
		const { width, height } = Dimensions.get('screen');
		var portada = require('../assets/img/dc.jpg');
		let { nueva_imagen } = this.state
		if(this.state.store !== null){
			let {images} = this.state.store;
			//Alert.alert('--', JSON.stringify(images));
			if(Array.isArray(images.self)){
				if(images.self.length > 0){
					let imgSrc = ( (images.self.length - 1) < 0 ) ? images.self[0] : images.self[ (images.self.length - 1) ];
					
					let url = imgSrc.cover_url;
					
					portada = { uri: url };
					//Alert.alert('URL', JSON.stringify(portada));
				}
			}
		}
		if(nueva_imagen !== null){
			portada = {uri: nueva_imagen[0]};
			//Alert.alert('DEUG', JSON.stringify(portada))
		}			

		return(
			<Container style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
						<Row style={{marginTop:"50%"}}>
							<Image
								source={portada}
								style={{
									maxHeight: 130,
									maxWidth:  width,
									flex: 1
								}}
							/>
						</Row>
						<Row style={{marginLeft: 7}}>

							<Col>
								<TouchableOpacity 
									onPress={()=>{
										this.takePhoto()
									}}
									style={{
										backgroundColor: "#02A6A4",
										width: "97%",
										alignSelf: "center",
										alignContent: "center",
										marginTop: 9
									}}
								>
									<FontAwesome style={{color: "#ffffff", fontSize: 52, textAlign: "center"}}>{Icons.pictureO}</FontAwesome>
									
								</TouchableOpacity>
							</Col>
						</Row>
			          <Fab
			          	disabled={this.state.nueva_imagen ? false : true}
			            containerStyle={{ }}
			            style={{ backgroundColor: this.state.nueva_imagen ? '#02A6A4' : 'gray' }}
			            position="bottomRight"
			            onPress={() => { this.setState({ onSavePress: true }); this.save(); } }>

			            {this.renderFabIcon()}
			          </Fab>
			</Container>
		);
	}

}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	}
}