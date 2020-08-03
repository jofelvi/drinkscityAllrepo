import React from 'react';
import PerfilEmpresa from '../classes/Perfil';

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
	Thumbnail,
	Row,
	Col,
	Grid,
	CheckBox
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	Image,
	AsyncStorage
} from 'react-native';

import FontAwesome, {Icons} from 'react-native-fontawesome';
var ImagePicker = require('react-native-image-picker');
import Connection from '../config/connection';

import Cropper from '../classes/Cropper';
var options = {
  title: 'Selecciona una opciòn',
	takePhotoButtonTitle: 'Tomar desde la camara',
	chooseFromLibraryButtonTitle: 'Elegir una desde la galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


import BackHandler from 'BackHandler';

export default class Perfil extends React.Component{

	static navigationOptions = {
		title: 'PERFIL',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}

	constructor(props){
		super(props);
		this.state = {
			delivery: undefined,
			logo: null,
			days_opened: {
				lun: {
					horario: null
				},
				mar: {
					horario: null
				},
				mier: {
					horario: null
				},
				juev: {
					horario: null
				},
				vier: {
					horario: null
				},
				sab: {
					horario: null
				},
				dom: {
					horario: null
				}
			},
		}
	}

	takePhoto(){
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

				let b64Crop = crop.cropping(response.path, 600, 500);

				setTimeout(()=>{
					this.setState({
						logo: 'data:image/jpeg;base64,'+b64Crop._55.data,
					});
					//Alert.alert('DEBUG', JSON.stringify(this.state.images))
				}, 3000)
			}
			
		});
	}

	async componentDidMount(){
		let session = await AsyncStorage.getItem('@session');
		let {store} = JSON.parse(session);
		this.setState({
			...store,
		});
		// Alert.alert('DEBUG', JSON.stringify(this.state.logo))

	}

	componentWillMount(){
		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}

	async saveUpdate(){
		const con = new Connection();
		let session = await AsyncStorage.getItem('@session');
		  	session = await JSON.parse(session)
		const url = con.getUrlApi('stores/'+this.state.id);

		let body = ` { "store": ${JSON.stringify(this.state)} } `
		let resp = fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'json',
				Authorization: session.token.token
			},
			body
		}).then( resp =>{
			//Alert.alert('DB', JSON.stringify(resp))
			if(resp.status == 200 || resp.status == '200' || resp.status == 201 || resp.status == '201'){
				session.store = this.state;
				AsyncStorage.setItem("@session", JSON.stringify(session))
				Alert.alert('Confirmacion', 'Los datos de la tienda han sido correctamente actualizados', [
					{
						text: 'Aceptar',
						onPress: () => { this.props.navigation.goBack(); }
					}

				]);
			}
		} );	
	}

 	update(){

		Alert.alert('Advertencia', '¿Seguro que desea realizar esta modificacion?', [
			{
				text: 'Aceptar',
				onPress: ()=> { this.saveUpdate() }
			},
			{
				text: 'Cancelar',
				onPress: ()=> { this.props.navigation.goBack() }
			}
		]);

	}
 	/*
 	 */

	_onDaysInputChange( value, dia ){
		let { days_opened } = this.state;
		// alert(JSON.stringify(days_opened))
		// days_opened[dia].horario = value;
		this.setState({
			days_opened
		});
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		let store = null;
		store = ( this.state.delivery !== undefined ) ? this.state: null;

		return(
			<Container style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<Content>
					<Form>
						<Grid style={{marginTop: 5, marginLeft: 15}}>
							<Row>
							<Col style={{width: "95%"}}>
								<Image
									source={{uri: this.state.logo}}
									style={{
										width: "100%",
										height: 220,
										flex: 1
									}}
								/>
							</Col>
							</Row>
							<Row>
							<Col style={{width: "95%"}}>
 								<TouchableOpacity 
									onPress={()=>{this.takePhoto()}}
									style={{
										backgroundColor: "#02A6A4",
										width: "97%",
										alignSelf: "center",
										alignContent: "center",
										marginTop: 9,										
										backgroundColor :"#02A6A4"
									}}
								>

									<FontAwesome  
										 style={{color: "#ffffff", fontSize: 52, textAlign: "center"}}
									>
										{Icons.pictureO}
									</FontAwesome>
								</TouchableOpacity>
							</Col>
							</Row>
						</Grid>
						<Col style={{width: "95%"}}>
							<Item floatingLabel>
								<Label style={{color: "#ffffff"}}> Nombre de la tienda </Label>
								<Input
									multiline={true}
									numberOfLines={2}
									style={{color: "#ffffff"}}
									value={ (store !== null) ? this.state.name : 'Cargando...' }
									onChangeText={text => { this.setState({name: text }); }}
								/>
							</Item>
						</Col>
						<Col style={{width: "95%"}}>
							<Item floatingLabel>
								<Label style={{color: "#ffffff"}}> Reseña </Label>
								<Input
									multiline={true}
									numberOfLines={2}
									style={{color: "#ffffff"}}
									value={ (store !== null) ? this.state.description : 'Cargando...' }
									onChangeText={text => { this.setState({description: text }); }}
								/>
							</Item>
						</Col>
						<Col style={{width: "95%"}}>
							<Item floatingLabel>
								<Label style={{color: "#ffffff"}}> Direccion </Label>
								<Input
									multiline={true}
									numberOfLines={2}
									style={{color: "#ffffff"}}
									value={ (store !== null) ? this.state.address : 'Cargando...' }
									onChangeText={text => { this.setState({address: text }); }}
								/>
							</Item>
						</Col>
						<Col style={{width: "95%"}}>
							<Item floatingLabel>
								<Label style={{color: "#ffffff"}}> Email </Label>
								<Input
									multiline={true}
									numberOfLines={2}
									style={{color: "#ffffff"}}
									value={ (store !== null) ? this.state.email : 'Cargando...' }
									onChangeText={text => { this.setState({email: text }); }}
								/>
							</Item>
						</Col>
						<Col style={{width: "95%"}}>
							<Item floatingLabel>
								<Label style={{color: "#ffffff"}}> Telefono </Label>
								<Input
									style={{color: "#ffffff"}}
									value={(store !== null) ? this.state.phone : 'Cargando...'}
									onChangeText={ text => { this.setState({phone: text }); } }
							
								/>
							</Item>
						</Col>
						<Grid>
								<Row>
									<Col style={{width: "95%"}}>
									<Item stackedLabel>
										<Label style={{color: "#ffffff"}}>Lunes</Label> 
										<Input onChangeText={ text => { this._onDaysInputChange( text, 'lun' )  } } style={{color: "#ffffff"}} placeholder={"HH:MM AM/PM - HH:MM AM/PM"} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item stackedLabel>
										<Label style={{color: "#ffffff"}}>Martes</Label> 
										<Input onChangeText={ text => { this._onDaysInputChange( text, 'mar' )  } } style={{color: "#ffffff"}} placeholder={"HH:MM AM/PM - HH:MM AM/PM"} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item stackedLabel>
										<Label style={{color: "#ffffff"}}>Miercoles</Label> 
										<Input onChangeText={ text => { this._onDaysInputChange( text, 'mier' )  } } style={{color: "#ffffff"}} placeholder={"HH:MM AM/PM - HH:MM AM/PM"} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item stackedLabel>
										<Label style={{color: "#ffffff"}}>Jueves</Label> 
										<Input onChangeText={ text => { this._onDaysInputChange( text, 'juev' )  } } style={{color: "#ffffff"}} placeholder={"HH:MM AM/PM - HH:MM AM/PM"} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item stackedLabel>
										<Label style={{color: "#ffffff"}}>Viernes</Label> 
										<Input onChangeText={ text => { this._onDaysInputChange( text, 'vier' )  } } style={{color: "#ffffff"}} placeholder={"HH:MM AM/PM - HH:MM AM/PM"}  />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item stackedLabel>
										<Label style={{color: "#ffffff"}}>Sabado</Label> 
										<Input onChangeText={ text => { this._onDaysInputChange( text, 'sab' )  } } style={{color: "#ffffff"}} placeholder={"HH:MM AM/PM - HH:MM AM/PM"}  />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item stackedLabel>
										<Label style={{color: "#ffffff"}}>Domingo</Label> 
										<Input onChangeText={ text => { this._onDaysInputChange( text, 'dom' )  } } style={{color: "#ffffff"}} placeholder={"HH:MM AM/PM - HH:MM AM/PM"} />
									</Item>
									</Col>
								</Row>
{/*							<Col style={{width: "47.5%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Dias de atencion </Label>
									<Input
										style={{color: "#ffffff"}}
										value={(store !== null) ? this.state.days_opened : 'Cargando...'}
										onChangeText={ text =>{ this.setState( {laboral_days: text} ); } }
									/>
								</Item>
							</Col>*/}
							<Col style={{width: "47.5%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Horario </Label>
									<Input
										style={{color: "#ffffff"}}
										value={ (store !== null) ? this.state.time_opened : 'Cargando...' }
										onChangeText={text =>{ this.setState({hourary: text}); } }
								/>
								</Item>
							</Col>
						</Grid>
						<Grid>
							<Col style={{width: "95%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Representante legal </Label>
									<Input
										multiline={true}
										numberOfLines={2}
										style={{color: "#ffffff"}}
										value={ (store !== null) ? this.state.legal_agent : 'Cargando...' }
										onChangeText={text => { this.setState({legal_agent: text }); }}
									/>
								</Item>
							</Col>
						</Grid>
						<Grid>
							<Col style={{width: "95%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Email del rep/legal </Label>
									<Input
										multiline={true}
										numberOfLines={2}
										style={{color: "#ffffff"}}
										value={ (store !== null) ? this.state.legal_agent_email : 'Cargando...' }
										onChangeText={text => { this.setState({legal_agent_email: text }); }}
									/>
								</Item>
							</Col>
							<Col style={{width: "95%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Telefono del rep/legal </Label>
									<Input
										multiline={true}
										numberOfLines={2}
										style={{color: "#ffffff"}}
										value={ (store !== null) ? this.state.legal_agent_phone : 'Cargando...' }
										onChangeText={text => { this.setState({legal_agent_phone: text }); }}
									/>
								</Item>
							</Col>
						</Grid>
						<Grid>

							<Col style={{width: "95%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Rut del rep/legal </Label>
									<Input
										multiline={true}
										numberOfLines={2}
										style={{color: "#ffffff"}}
										value={ (store !== null) ? this.state.legal_agent_rut : 'Cargando...' }
										onChangeText={text => { this.setState({legal_agent_rut: text }); }}
									/>
								</Item>
							</Col>
						</Grid>
						<Grid style={{marginTop: 5, marginLeft: 7}}>
							<Col style={{width: "10%"}}>
								<CheckBox 
									checked={ (store !== null && this.state.delivery === true)  } 
									onPress={()=>{  this.setState({ delivery:  !this.state.has_delivery }); }} 
									color={"#02A6A4"}
								/>
							</Col>
							<Col style={{width: "85%"}}>
								<Text style={{color: "#ffffff"}}>Tiene delivery</Text>
							</Col>
						</Grid>
						<Grid style={{marginTop: 5, marginLeft: 15}}>
							<Col style={{width: "95%"}}>
								<Button onPress={ ()=> { this.update() } } block style={{backgroundColor :"#02A6A4"}}>
									<Text style={{color:"#ffffff"}}>
										Guardar
									</Text>
								</Button>
							</Col>
						</Grid>
					</Form>
				</Content>
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