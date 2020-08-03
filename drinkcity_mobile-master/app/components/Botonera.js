import React from 'react';
import {
	Container,
	Content,
	View,
	Row,
	Grid,
	Col,
	Text
} from 'native-base';

import {
	TouchableOpacity,
	Image,
	AsyncStorage
} from 'react-native'

import BackgroundButton from './BackgroundButton';

export default class Botonera extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			user: null
		};
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);

		this.setState({
			user: session.user
		})
	}

	render(){

		let invitados = null;
		let cmr = null;
		let rrpp_eventos = null;
		let qr = null;
		let s = null;
		let productos = null;
		let mis_productos = null;
		let funcionarios = null;
		let mis_funcionarios = null;
		let eventos = null;
		let mis_eventos = null;
		let ventas = null;
		if( this.state.user !== null ){
			if( this.state.user.role == 'validator' || this.state.user.role == 'store_admin' ){
				cmr = (
					<TouchableOpacity onPress={()=>{ this.props.navigation.navigate('Videos') }} >
						<BackgroundButton 
							// image={require('../assets/img/banda.png')}
							text={'VIDEO'} 
							font_size={14}
							// btnSize={84}
							image={require('../assets/img/qrmini.png')}
						/>
					</TouchableOpacity>	
				)
			}
			if( this.state.user.role == 'validator' || this.state.user.role == 'store_admin' ){
				qr = (
					<TouchableOpacity onPress={()=>{ this.props.navigation.navigate('QRScanner') }} style={{marginBottom: "7%"}}>
						<BackgroundButton 
							// image={require('../assets/img/banda.png')}
							text={'ESCANEAR'} 
							font_size={14}
							icon={require('../assets/img/banda.png')}
						/>
					</TouchableOpacity>	
				)
			}
			// if( this.state.user.role == 'validator' || this.state.user.role == 'store_admin'  ){
			// 	s = (
			// 		<TouchableOpacity onPress={()=>{ this.props.navigation.navigate('Streaming') }} style={{marginBottom: "7%"}}>
			// 			<BackgroundButton 
			// 				image={require('../assets/img/banda.png')}
			// 				text={'STREAMING'} 
			// 				font_size={14}
			// 			/>
			// 		</TouchableOpacity>	
			// 	)
			// }	
			if( this.state.user.role == 'store_admin' ){
				productos = (

					<TouchableOpacity onPress={()=>{this.props.navigation.navigate('CrearProductosScreen')}}>
						<BackgroundButton 
							image={require('../assets/img/banda.png')}
							text={'CREAR PRODUCTO'} 
							font_size={14}
						/>
					</TouchableOpacity>
				);
			}

			if( this.state.user.role == 'store_admin' ){
				mis_productos = (
								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Productos', { side: 'Home' })}}>
									<BackgroundButton 
										image={require('../assets/img/banda.png')}
										text={'MIS PRODUCTOS'} 
										font_size={14}
									/>
								</TouchableOpacity>
				);
			}

			if( this.state.user.role == 'store_admin' ){
				funcionarios = (
								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormFuncionario', {titulo: 'CREAR FUNCIONARIO', accion: 'crear' ,funcionario: false})}}>
									<BackgroundButton 
										image={require('../assets/img/banda.png')}
										text={'CREAR FUNCIONARIOS'} 
										font_size={14}
									/>
								</TouchableOpacity>
				);
			}

			if( this.state.user.role == 'store_admin' ){
				mis_funcionarios = (
								<TouchableOpacity onPress={ ()=>{ this.props.navigation.navigate('BtnFuncionarios', {titulo: 'FUNCIONARIOS', funcionario: false}); } }>
									<BackgroundButton 
										image={require('../assets/img/banda.png')}
										text={'MIS FUNCIONARIOS'} 
										font_size={14}
									/>
								</TouchableOpacity>
				);
			}
			

			if( this.state.user.role == 'store_admin' ){
				eventos = (
								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormsEvents', {titulo: 'Tipo de evento', side: 'Hone', event: false})}}>
									<BackgroundButton 
										image={require('../assets/img/banda.png')}
										text={'CREAR EVENTO'} 
										font_size={14}
									/>
								</TouchableOpacity>
				);
			}

			if(this.state.user.role == 'rrpp'){
				rrpp_eventos = (
								<TouchableOpacity onPress={()=> { this.props.navigation.navigate('RrppEventos',{titulo: 'Listado de eventos publicados', side: 'Home', event: false}) } }>
									<BackgroundButton 
										image={require('../assets/img/banda.png')}
										text={'MIS EVENTOS'} 
										font_size={14}
									/>
								</TouchableOpacity>
				);
			}

			if( this.state.user.role == 'store_admin'){
				mis_eventos = (
								<TouchableOpacity onPress={()=> { this.props.navigation.navigate('Eventos',{titulo: 'Listado de eventos publicados', side: 'Home', event: false, user: this.state.user}) } }>
									<BackgroundButton 
										image={require('../assets/img/banda.png')}
										text={'MIS EVENTOS'} 
										font_size={14}
									/>
								</TouchableOpacity>
				);
			}

			if( this.state.user.role == 'store_admin' ){
				ventas = (
								<TouchableOpacity 
									onPress={()=>{
										this.props.navigation.navigate('VentasScreen', {titulo: "Ventas"})
									}}
								>
									<BackgroundButton 
										image={require('../assets/img/banda.png')}
										text={'MIS VENTAS'} 
										font_size={14}
									/>
								</TouchableOpacity>
				);
			}
		}
		return(
			<View 
				style={{marginTop: "30%", marginLeft: "3%"}}
				
			>
					<Grid>
						<Row style={{justifyContent: 'center', alignItems: 'center'}}>
								{qr}
						</Row>

						<Row style={{marginBottom: 30}}>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{productos}
							</Col>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{cmr}
							</Col>
						</Row>

						<Row style={{marginBottom: 30}}>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{mis_productos}
							</Col>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{eventos}
							</Col>
						</Row>

						<Row style={{marginBottom: 30}}>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{funcionarios}
							</Col>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{mis_eventos}
							</Col>
						</Row>


						<Row style={{marginBottom: 30}}>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{mis_funcionarios}
							</Col>
							<Col style={{justifyContent: 'center', alignItems: 'center'}}>
								{rrpp_eventos || ventas}
							</Col>
						</Row>
					</Grid>
			</View>
		);
	}
}

const styles = {
	btnText: {
		color: "#ffffff",
		fontSize: 15,
		alignText: "center"
	},
	btnImg: {
		flex: 1,
		width: undefined,
		height: undefined,
		backgroundColor: 'transparent',
		justifyContent: "center",
		alignItems: "center"
	}
}