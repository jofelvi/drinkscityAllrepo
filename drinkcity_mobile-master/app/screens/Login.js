import React from 'react';

import {
	Dimensions,
	Alert,
	Image,
	StatusBar,
	TouchableOpacity,
	AsyncStorage,
	Keyboard,
	StyleSheet, 
	TextInput
} from 'react-native';

import {

	Body,
	Col,
	Grid,
	Row,
	Container,
	Content,
	View,
	Text,
	H2,
	Thumbnail,
	Input,
	Form,
	Label,
	Item,
	Button

} from 'native-base';

import Connection from '../config/connection';

import FontAwesome, {Icons} from 'react-native-fontawesome'
import BackHandler from 'BackHandler';

const con = new Connection();

const inputStyles = StyleSheet.create({
	inputLogin: {
		color: "#ffffff"
	}
})

export default class Login extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			email: null,
			password: null,
			loading: false,
			text: 'Ingresar',
			sessionActive: false,
			passborderColor: "#ffffff",
			passchangeColor: true,
			mailborderColor: "#ffffff",
			mailchangeColor: true
		};


	}

	componentWillMount(){
		BackHandler.addEventListener('hardwareBackPress',()=>{
			BackHandler.exitApp();
			return false;
		});
	}

	async requestLogin(){

		try{
			if( (this.state.email == null || this.state.password == null) || ( this.state.email == "" || this.state.password == "" ) ){
				Alert.alert('Aviso', 'Usted necesita completar los datos solicitados para poder iniciar sesion', [
					{
						text: 'Entiendo'	
					}
				]);
				return false;
			}

			this.setState({ loading: true, text: 'Cargando...' });

			let login = await fetch( con.getUrlApi('authenticate', false), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'json'
				},
				body: JSON.stringify(this.state)
			}).then(resp => {
				let { _bodyInit } = resp;
				_bodyInit = JSON.parse(_bodyInit);
				var data = _bodyInit;
				if(resp.status == 200 || resp.status == '200'){
					let session = {
						token: data.auth_token,
						user: data.current_user
					}
					AsyncStorage.setItem('@session', JSON.stringify(session));
				    this.props.navigation.navigate('SelectStoreScreen', {token: session});
					
				}
				else{
					Alert.alert('Credenciales invalidas', 'La combinacion de usuario y contraseña ingresada no son correctas, vuelva a intentar', [
						{
							text: 'Aceptar'	
						}
					]);
				}
				this.setState({ loading: false, text: 'Ingresar'});
			});
		}catch(err){
			console.log(err);
			this.setState({ loading: false, text: 'Ingresar'});
			Alert.alert('Error de conectividad', JSON.stringify(err)+'Verifique que esta correctamente conectado a internet y vuelva a intentarlo', [
					{
						text: 'aceptar'
					}
				]);
		}
	}

	render(){
		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#111111'} />
				<Container>
					<Content style={{ backgroundColor: '#111111'}}>
						<Form>
							<Grid>
								<Row style={{width: "100%"}}>
									<Col style={{width: "100%"}}>
										<View style={{alignSelf: "center"}}>
											<Image
												source={require('../assets/img/Logo_Drinks-City.png')}
												style={{
													marginTop: 7,
													width: 290,
													height: 190,
													flex: 1,
													resizeMode: 'contain'
												}}
											/>
										</View>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
										<Item floatingLabel style={{ borderColor: this.state.mailborderColor }}>
											<Label style={{color: "#ffffff"}}>Correo electrónico</Label>
											<Input 
												Color={"#FFFFFF"}
												tintColor={"#FFFFFF"}
												style={{borderColor: this.state.passborderColor, color: "#ffffff"}}
												onFocus={ ev => { this.setState({ mailborderColor: '#01DAC9' }) } }
												onBlur={ br =>{ this.setState({ mailborderColor: ( (this.state.mailchangeColor) ? '#ffffff' : '#01DAC9' ) }) } }
												underlineColorAndroid={this.state.mailchangeColor}
												onChangeText={text =>{ this.setState({ email: text }); this.setState({ mailchangeColor: (text.length == 0) }); } }
											/>

										</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
										<Item floatingLabel style={{ borderColor: this.state.passborderColor }}>
											<Label style={{color: "#ffffff"}}>Contraseña</Label>
											<Input 
												Color={"#FFFFFF"}
												tintColor={"#FFFFFF"}
												style={{borderColor: this.state.passborderColor, color: "#ffffff"}}
												onFocus={ ev => { this.setState({ passborderColor: '#01DAC9' }) } }
												onBlur={ br =>{ this.setState({ passborderColor: ( (this.state.passchangeColor) ? '#ffffff' : '#01DAC9' ) }) } }
												secureTextEntry={true}
												underlineColorAndroid={this.state.mailchangeColor}
												onChangeText={text =>{ this.setState({ password: text });  this.setState({ passchangeColor: (text.length == 0) }); } }
											/>

										</Item>
									</Col>
								</Row>
								<Row style={{alignItems: "center", alignSelf: "center", alignContent: "center"}}>
									<Col style={{width: "84%"}}>
										<Button disabled={this.state.login} onPress={()=>{ Keyboard.dismiss(); this.requestLogin();  }} block  style={{marginTop: 10, backgroundColor: "#02A6A4"}}>
											<Text style={{color: "#ffffff"}}>
												{this.state.text}
											</Text>
										</Button>
									</Col>
								</Row>

								<Row style={{marginTop: 6, marginBottom: 6 ,alignSelf: "center", alignItems: "center"}}>
									<Col style={{width: "84%", borderBottomWidth: 1, borderColor: "#ffffff"}}>
									</Col>
								</Row>
								<Row style={{alignItems: "center", alignSelf: "center", alignContent: "center"}}>
									<Col style={{width: "84%"}}>
										<Button onPress={()=>{ this.props.navigation.navigate('FormFuncionario', {accion:'from_login',funcionario: false, side: 'login', titulo: "Registro de tienda - Usuario"}) }} block  style={{ backgroundColor: "#02A6A4"}}>
											<Text style={{color: "#ffffff"}}>
												Registrarme
											</Text>
										</Button>
									</Col>
								</Row>
							</Grid>
						</Form>
					</Content>
				</Container>
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