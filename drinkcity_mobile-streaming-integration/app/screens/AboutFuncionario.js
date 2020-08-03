import React from 'react';
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
	List,
	ListItem,
	Icon,
	Right,
	Left,
	Body,
	Picker,
	Col,
	Row,
	Grid
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView,
	AsyncStorage
} from 'react-native';


import Connection from '../config/connection';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import Funcionario from '../classes/Funcionario';
import { funcionario } from '../redux/actions';

var BackHandler = require('BackHandler')

export default class AboutFuncionario extends React.Component{

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.titulo}`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" },
		headerLeft: null,
		headerRight: <Button onPress={()=>{navigation.goBack()}} transparent><FontAwesome style={{color:"#ffffff", fontSize: 22}}>{Icons.close}</FontAwesome></Button> 
	
	});

	constructor(props){
		super(props);

		const { navigation } = this.props;
		const { state } = navigation;
		let func = ( state.params.funcionario != false ) 
			? state.params.funcionario 
			: {fullname: '', email: '', password: '', phone: '', role: 'validator', rut: ''};
		
		this.state = {
			funcionario: new Funcionario(func),
			...func,
			markers: []
		}

		if( navigation.state.params.side == 'login' )
			this.setState({ role: this.state.funcionario.setAttribute('role', 'store_admin' ) });

	}

	async _saveUserToStore(){
		const con = new Connection();
		const body = '{"user":'+JSON.stringify(this.state.funcionario.getData())+'}';
		let resp = fetch( con.getUrlApi('users'), {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json',
				Accept: 'json'
			},
			body
		}).then(resp =>{
			let data = ( typeof(resp) == 'string' ) ? JSON.parse(resp) : resp;
			if( data.ok )
			{
				this.props.navigation.goBack();
				return false;
			}else{
				Alert.alert('Advertencia', 'Algo ha salido mal; estamos trabajando para solventar este incidente', [
					{
						text: 'Aceptar',
						onPress: ()=> { this.props.navigation.goBack(); }
					}
				]);
			}
		});
	}
	
	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}

	_accion(accion, resp){

		const { state } = this.props.navigation;

		eval(accion);
		const { navigation } = this.props;

		// navigation.state.params.onBack(true);
	}

	async componentDidMount(){
		let session = await AsyncStorage.getItem('@session');
		let { store } = await JSON.parse(session);
		this.setState({
			store_id: this.state.funcionario.setAttribute('store_id', store.id)
		});

	}

	_saveUser(){
		Alert.alert(
			'Confirme la accion',
			'Esta seguro de realizar esta accion?',
			[
				{
					text: 'Aceptar',
					onPress: ()=>{
						let resp = this.state.funcionario.push(this.props.navigation);
						this._accion(this.props.navigation.goBack());
					}
				}
			]
		);
	}

	renderPicker(){
		const { funcionario } = this.state;
		const roles = funcionario.getRoles();
		return roles.map( (data)=>{
			return <Item style={{color: "#ffffff"}} label={data.alias} value={data.name} />
		});
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		const { state } = this.props.navigation;
		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<ScrollView>
					<Form>
						<Grid>
							<Row>
								<Col style={{width: "95%"}} >
									<Item floatingLabel>
										<Label 
											style={{ color:  "#ffffff"}} >Nombre completo
										</Label>
										<Input 
											value={this.state.fullname}
											onChangeText={ text => { this.setState({ fullname: this.state.funcionario.setAttribute('fullname', text) }); } }
											style={{ color:  "#ffffff"}} 
										/>
									</Item>
								</Col>
							</Row>
							<Row>
								<Col style={{width: "95%"}} >
									<Item floatingLabel>
										<Label 
											style={{ color:  "#ffffff"}} >RUT
										</Label>
										<Input 
											value={this.state.rut}
											onChangeText={ text => { this.setState({ rut: this.state.funcionario.setAttribute('rut', text) }); } }
											style={{ color:  "#ffffff"}} 
										/>
									</Item>
								</Col>
							</Row>
							<Row>
								<Col style={{width: "95%"}} >
									<Item floatingLabel>
										<Label 
											style={{ color:  "#ffffff"}} >Correo Electronico
										</Label>
										<Input 
											value={this.state.email}
											onChangeText={ text => { this.setState({ email: this.state.funcionario.setAttribute('email', text) }); } }
											style={{ color:  "#ffffff"}} 
										/>
									</Item>
								</Col>
							</Row>
							<Row>
								<Col style={{width: "95%"}} >
									<Item floatingLabel>
										<Label 
											style={{ color:  "#ffffff"}} >Asignar una clave
										</Label>
										<Input 
											secureTextEntry={true}
											value={this.state.password}
											onChangeText={ text => { this.setState({ password: this.state.funcionario.setAttribute('password', text) }); } }
											style={{ color:  "#ffffff"}} 
										/>
									</Item>
								</Col>
							</Row>
							<Row>
								<Col style={{width: "95%"}} >
									<Item floatingLabel>
										<Label 
											style={{ color:  "#ffffff"}} >Telefono
										</Label>
										<Input 
											value={this.state.phone}
											onChangeText={ text => { this.setState({ phone: this.state.funcionario.setAttribute('phone', text) }); } }
											style={{ color:  "#ffffff"}} 
										/>
									</Item>
								</Col>
							</Row>
						<Text style={{color :"#ffffff", fontSize: 17, marginTop: 5, marginLeft: 14.3}}>
							Tipo
						</Text>
						<Picker
							mode='dropdown'
							onValueChange={(value)=>{ this.setState({ role: this.state.funcionario.setAttribute('role',value ) }); }}
							style={{ color:  "#ffffff", marginLeft: 14.3}}
							selectedValue={this.state.role}
						>
							{
							  (this.props.navigation.state.params.side != 'login')	?
							  	this.state.funcionario.getRoles().map( (data, i) =>  
							  		<Item key={i} style={{color: "#ffffff"}}  label={data.description} value={data.name} /> 
							  	) : <Item key={1} style={{color: "#ffffff"}}  label={'Store admin'} value={'store_admin'} />
							}
						</Picker>
						</Grid>
					</Form>

					<Button onPress={()=>{ 
							const { navigation } = this.props;
							//from_login
							if( navigation.state.params.accion == 'from_login' )
								this._saveUserToStore();
							else if( navigation.state.params.accion == 'crear' )
								this._saveUser();
							else
								this.state.funcionario.update('PUT', navigation); 
						}}  
						block 
						style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}
					>
						<Text style={{color:"#ffffff"}}>CREAR</Text>
					</Button>
				</ScrollView>
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