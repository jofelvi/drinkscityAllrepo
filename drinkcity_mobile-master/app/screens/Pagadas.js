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
	Picker,
	Grid,
	Row,
	Col,
	Thumbnail
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	Image,
	ScrollView,
	AsyncStorage,
	Keyboard
} from 'react-native';
import Publicacion from '../classes/Publicacion';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Ticket from '../classes/Ticket'
import Cropper from '../classes/Cropper';
import Connection from '../config/connection'
var ImagePicker = require('react-native-image-picker');
import DateTimePicker from 'react-native-modal-datetime-picker';


var BackHandler = require('BackHandler')
const moment = require ('moment');

var options = {
  title: 'Cargar imagenes',
	takePhotoButtonTitle: 'Tomar desde la camara',
	chooseFromLibraryButtonTitle: 'Elegir una desde la galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class Pagadas extends React.Component{


	static navigationOptions = ({navigation}) => ({
		headerStyle: { backgroundColor: "#01DAC9" },
	});


	constructor(props){
		super(props);
		pub = new Ticket();
		this.state = {
			stores: [],
			pub,
			con: new Connection(),
			showPicker: false,
			from: '',
			ref_startdatetime: null,
			ref_enddatetime: null,
			event: null,
		};

	}
	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}

	render(){
		return(
			<View style={styles.container}>
				
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