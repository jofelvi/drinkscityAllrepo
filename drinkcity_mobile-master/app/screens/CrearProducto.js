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
	Row,
	Col
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert
} from 'react-native';
var BackHandler = require('BackHandler')


export default class CrearProducto extends React.Component{

	static navigationOptions = {
		title: 'CREAR PRODUCTO',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}

	constructor(props){
		super(props);
	}
	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}
	render(){
		const { width, height } = Dimensions.get('screen')


		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<Container style={{ backgroundColor: '#111111' }}>
					<Content>
						<List>
							<Row>
								<Col style={{width: "95%"}} >
							<ListItem>
								<Body>
									<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Estandar', {from: 'Botonera',item_type: 'Store', tipo: "ESTANDAR", titulo: "PUBLICACION ESTANDAR", dato: false, priority: 0})}}>
										<Text style={{color: "#ffffff"}}>PUBLICACION ESTANDAR</Text>
									</TouchableOpacity>
								</Body>
							</ListItem>
							<ListItem>
								<Body>
									<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Estandar', {from: 'Botonera',item_type: 'Store', tipo: "ESTANDAR", titulo: "OFERTA DEL MOMENTO", dato: false, priority: 1})}}>
										<Text style={{color: "#ffffff"}}>OFERTA DEL MOMENTO</Text>
									</TouchableOpacity>
								</Body>
							</ListItem>
							<ListItem>
								<Body>
									<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Estandar', {from: 'Botonera',item_type: 'Store', tipo: "ESTANDAR", titulo: "PROMOCION", dato: false, priority: 2})}}>
										<Text style={{color: "#ffffff"}}>PROMOCION</Text>
									</TouchableOpacity>
								</Body>
							</ListItem>
							<ListItem>
								<Body>
									<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Estandar', {from: 'Botonera',item_type: 'Store', tipo: "ESTANDAR", titulo: "PUBLICACION DESTACADA", dato: false, priority: 3})}}>
										<Text style={{color: "#ffffff"}}>PUBLICACION DESTACADA</Text>
									</TouchableOpacity>
								</Body>
							</ListItem>
							<ListItem>
								<Body>
									<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Estandar', {from: 'Botonera',tipo: "ESTANDAR", titulo: "PUBLICACION VIP", dato: false, priority: 4})}}>
										<Text style={{color: "#ffffff"}}>PUBLICACION VIP (Slide Principal)</Text>
									</TouchableOpacity>
								</Body>
							</ListItem>
								</Col>

							</Row>
						</List>
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