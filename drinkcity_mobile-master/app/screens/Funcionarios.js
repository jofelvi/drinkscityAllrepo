import React from 'react';
import {Perfil as PerfilEmpresa} from '../classes/Perfil';

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
	Fab
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView,
	Root,
	AsyncStorage
} from 'react-native';

import FontAwesome, {Icons} from 'react-native-fontawesome';
import Funcionario from '../classes/Funcionario';
import Connection from '../config/connection';
import { store } from '../redux/store';

var BackHandler = require('BackHandler')

export default class Funcionarios extends React.Component{

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.titulo}`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" },
	});

	constructor(props){
		super(props);
		this.funcionario = new Funcionario();
		this.fillables = this.funcionario.getFillables();

		this.state = {
			funcionarios: [],
			validadores: [],
			rrpp: [],
			complete: false,
			users: []
		};

		// store.subscribe( ()=>{
		// 	let objects = JSON.parse(store.getState().users).filter( func => func);
		// 	this.setState({
		// 		funcionarios: objects
		// 	});
		// })
	}

	onBack = complete => {
		this.setState({ complete });
		if(complete){
			Alert.alert('Exito', 'El usuario ha sido creado satisfactoriamente');	
		}
	}

	async componentDidMount(){
		let con = new Connection();
		let session = await AsyncStorage.getItem('@session');
		let { token, store } = await JSON.parse(session);
		let resp = await fetch( con.getUrlApi('stores/'+store.id), {
			headers:{
				method: 'GET',
				'Content-Type': 'application/json',
				Accept: 'json',
				Authorization: token.token
			}
		} ).then( resp => {

			if(resp.status == 200 || resp.status == '200'){
				let _bodyInit = JSON.parse(resp._bodyInit);
				let { users } = _bodyInit;
				this.setState({
					funcionarios: users
				});
				//Alert.alert('DEBUG', JSON.stringify(this.state.funcionarios))
			}

		});
	}

	componentWillMount(){
		let dat = this.funcionario.getAll();

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}

	onDelete(func){
		 (new Funcionario(func)).delete();

		 let objects = this.state.funcionarios.filter( data =>{
		 	return data.id !=  func.id
		 } )
		 this.setState({
		 	funcionarios: objects
		 })
	}

	onUpdate = update =>{
		let dat = this.funcionario.getAll();
	}

	_renderListItems(){	
		const funcs = ( typeof(this.state.funcionarios) == 'string' ) ? JSON.parse(this.state.funcionarios) : this.state.funcionarios;
		const list = funcs.map( data =>{
			if( data.role == 'validator' || data.role == 'rrpp')
			return(
				<ListItem key={data.id}>
					<Body>
						<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormFuncionario', {titulo: data.fullname ? data.fullname : 'EDITAR USUARIO',accion: "editar", funcionario: data, onUpdate: this.onUpdate})}}>
							<Text style={{color: "#ffffff"}}>
								{ (data.fullname == null) ? 'No aplica' : data.fullname }
							</Text>
							{
								this.funcionario.getRoles().map( (rol, i)=> { 
									if(rol.name == data.role)
										return <Text key={i} note style={{color: "#ffffff"}}>{rol.description}</Text> 
								})
							}						
						</TouchableOpacity>
					</Body>
					<Right>
						<Button danger onPress={()=>{
							Alert.alert('Alerta','¿Esta seguro de realizar esta operacion?',[
								{
									text: 'Aceptar',
									onPress: ()=>{ this.onDelete(data) }
								},
								{
									text: 'Cancelar',
								}
							])
						}}>
								<FontAwesome>{Icons.trashO}</FontAwesome>
						</Button>
					</Right>
				</ListItem>
			);
		} );

		return list;
	}

	render(){
		const { width, height } = Dimensions.get('screen')


		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<ScrollView>
					<List
						leftOpenValue={75}
						rightOpenValue={-75}
					>
						{this._renderListItems()}
					</List>
				</ScrollView>
				<View style={{flex: 1}} >
					{/*
						<Fab
				            active={this.state.active}
				            direction="up"
				            containerStyle={{ }}
				            style={{ backgroundColor: '#02A6A4' }}
				            position="bottomRight"
				            onPress={()=>{this.props.navigation.navigate('FormFuncionario', {titulo: 'CREAR FUNCIONARIO', accion: 'crear' ,funcionario: false, onBack: this.onBack, onUpdate: this.onUpdate})}}>
				            
				            	<FontAwesome>{Icons.plus}</FontAwesome>
				            
		        </Fab>
	      	*/}
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