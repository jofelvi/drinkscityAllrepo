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
	ListItem
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert
} from 'react-native';

import PubEstandar from '../../components/forms/PubEstandar';
var BackHandler = require('BackHandler')

export default class PublicacionEstandar extends React.Component{

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.titulo || 'PRODUCTO'}`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	})

	constructor(props){
		super(props);

	}
	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}
	_renderForm(){
		 const { state } = this.props.navigation

		return <PubEstandar from={state.params.from} item_type={state.params.item_type} priority={state.params.priority} color={'#ffffff'} producto={state.params.producto} />
	}

	render(){
		const { width, height } = Dimensions.get('screen')

		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<Container style={{backgroundColor: '#111111'}}>
					<Content>
						{this._renderForm()}
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