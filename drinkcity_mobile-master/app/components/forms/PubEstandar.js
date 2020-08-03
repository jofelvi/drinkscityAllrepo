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
import Publicacion from '../../classes/Publicacion';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Product from '../../classes/Product'
import Cropper from '../../classes/Cropper';
import Connection from '../../config/connection'
var ImagePicker = require('react-native-image-picker');
import DateTimePicker from 'react-native-modal-datetime-picker';

const moment = require ('moment');

var options = {
  title: 'Selecciona una opción',
	takePhotoButtonTitle: 'Tomar desde la camara',
	chooseFromLibraryButtonTitle: 'Elegir una desde la galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class PubEstandar extends React.Component{
	constructor(props){
		super(props);
		var producto = null;

		if(this.props.from == 'Productos'){
			producto = this.props.producto 
			//Alert.alert('PRODUCTO-DEBUG', JSON.stringify(producto))
			producto.start_datetime =  moment(producto.start_datetime, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')
			producto.end_datetime =  moment(producto.end_datetime, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')
			//Alert.alert('D-3', JSON.stringify(this.props.producto))
		}
		else{  
			producto = {item_type: this.props.item_type ,image:'', user_id: new Number(0), item_id: '', priority: this.props.priority, stock: 0, name: '', category: 0, description: '', price: 0.00, start_datetime: moment(new Date(), 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS'), end_datetime: moment(new Date(), 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS') };
		}
		//Alert.alert('D', JSON.stringify(producto))
		pub = ( producto instanceof Product ) ? producto : new Product(producto);
		this.state = {
			image: '',
			category: '',
			...producto,
			stores: [],
			...pub.data,
			pub,
			con: new Connection(),
			showPicker: false,
			from: '',
			ref_startdatetime: null,
			ref_enddatetime: null,
			savePress: false
		};
	}


	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		this.setState({
			stores: session.stores,
			user_id: this.state.pub.setAttribute('user_id', session.user.id)
		});
		//Alert.alert('DE2', ''+this.state.pub.getAttribute('user_id'))
	}

	async componentDidMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		let { store } = session;
		this.setState({
			item_id: this.state.pub.setAttribute('item_id', store.id)
		});
		
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

				let b64Crop = crop.cropping(response.path, 600, 500);

				setTimeout(()=>{
					let image = this.state.pub.setAttribute('image', 'data:image/jpeg;base64,'+b64Crop._55.data );
						this.setState({
							image
						});
				}, 3000)
				 
				
				
			}
			
		});
	}

	_renderButton(){
		return (
			<Col>
				<TouchableOpacity 
								
					style={{
						backgroundColor: "#02A6A4",
						width: 170,
						alingSelf: "center",
						alignContent: "center",
						marginTop: 9
						}}
				>
					<FontAwesome style={{color: "#ffffff", fontSize: 52, textAlign: "center"}}>{Icons.camera}</FontAwesome>
								
				</TouchableOpacity>
			</Col>
		)
	}

	_validFormDate(date){
		var format = moment(date, 'YYYY-MM-DD');
		var format2 = moment(date, 'YYYY-MM-DD HH:MM:SS')

		if(format.isValid() || format2.isValid()){
			return format.format('YYYY-MM-DD HH:MM:SS');
		}
		return moment(new Date(), 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')
	}

	_renderImages(){
		let { image } = this.state;

		if( image.length > 0 )
		{
			let arr = image.split('base64');
			return (
				<Col style={{width: "95%"}}>
					<View style={{flex: 1, width: "100%", alignContent: "center", alignSelf: "center" , height: 150, marginTop: 10, marginBottom: 3}}>
						<Thumbnail 
							square  
							style={{
								width: "100%",
								height: 160
							}}
							source={{uri: (arr.length > 1)? image : image }} 
						/>
						<View style={{flex:1, position: 'absolute', top: 0, right: 0}}>
							<Button 
								rounded 
								danger 
								style={{elevation: 3, position: "absolute", right: 3}}
								onPress={()=>{
									this.setState({ image: ''  });
									this.state.pub.setAttribute('image', this.state.image);

								}}
							>
								<FontAwesome style={{color: "#ffffff", fontSize: 15}}>{Icons.close}</FontAwesome>
						</Button>
					</View>
				</View>
			</Col>
			);		
		}
		return null;
	}
	_hideDateTimePicker = () => this.setState({ showPicker: false });

	_handleDatePicked = (date) => {
		let dateParser = ( typeof(date) == 'object' ) ? date: JSON.parse(date);

	   switch(this.state.from){
	   		case 'start_datetime': {
	   			this.setState({ start_datetime: this.state.pub.setAttribute('start_datetime', moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')) });
	   			break;
	   		}
	   		case 'end_datetime':{
	   			this.setState({ end_datetime: this.state.pub.setAttribute('end_datetime', moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')) })
	   			
	   			break;
	   		}
	   }


	   this._hideDateTimePicker();
	};
	render(){
		return(
			<View>
				<Content>
					<Form>
						<Grid>
						<Row style={{marginLeft: 7, alignContent: "center", justifyContent: "center", alignSelf: "center"}}>
							{this._renderImages()}
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
						<Row>
							<Col style={{width: "98%"}}>
								<Item floatingLabel>
									<Label 
										style={{ color: this.props.color }} >Titulo del aviso
									</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ text =>{this.state.pub.setAttribute('name',text); this.setState({name: text}) }} 
										value={this.state.name} 
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{width: "95%", marginLeft: 10, marginTop: 20, borderBottomWidth: 1, borderBottomColor: 'white'}} >
								<Picker
									mode='dropdown'
									onValueChange={value => { this.state.pub.setAttribute('category', value); this.setState({category: value}); }}
									style={{ color: this.props.color }}
									selectedValue={this.state.category}
								>
									<Item style={{color: "#ffffff" }} label="Seleccione Una Categoria" value={''} />
									<Item style={{color: this.props.color }} label='Licores' value={'licores'} />
									<Item style={{color: this.props.color }} label='Cervezas' value={'cervezas'} />
									<Item style={{color: this.props.color }} label='Vinos' value={'vinos'} />
									<Item style={{color: this.props.color }} label='Tragos preparados' value={'tragos_preparados'} />
									<Item style={{color: this.props.color }} label='Insumos' value={'insumos'} />
									<Item style={{color: this.props.color }} label='Habitaciones' value={'habitaciones'} />
									<Item style={{color: this.props.color }} label='Comida' value={'comida'} />
								</Picker>
							</Col>
						</Row>
						<Row>
							<Col style={{width: "98%", marginTop: 20}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Detalles</Label>
									<Input  style={{ color: this.props.color }} value={this.state.description} onChangeText={text=>{ this.setState({description: this.state.pub.setAttribute('description', text)}); }} multiline={true} numberOfLines={4} />
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "49%", marginTop: 20 }} >
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Stock</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ stock =>{ this.setState({ stock: this.state.pub.setAttribute('stock', stock) }) }}  
										value={this.state.stock}
									/>
								</Item>
							</Col>
							<Col style={{width: "49%", marginTop: 20}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Precio $</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ price =>{ this.setState({ price: this.state.pub.setAttribute('price', price) }) }}  
										value={this.state.price}
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{width: "95%", marginTop: 20}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Fecha y hora de inicio</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ start_datetime =>{ this.setState({ start_datetime: this.state.pub.setAttribute('start_datetime', this._validFormDate(start_datetime)) }) }}  
										value={this.state.start_datetime}
										onFocus={ event =>{ Keyboard.dismiss(); this.setState({ showPicker: true, from: 'start_datetime' }); } }
										
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{width: "95%", marginTop: 20}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Fecha y hora de fin</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ end_datetime =>{ this.setState({ end_datetime: this.state.pub.setAttribute('end_datetime', this._validFormDate(end_datetime)  ) }); }}  
										value={this.state.end_datetime}
										onFocus={ event =>{ Keyboard.dismiss(); this.setState({ showPicker: true, from: 'end_datetime' }); } }
										
									/>
									
								</Item>
							</Col>
						</Row>
					      <View style={{ flex: 1 }}>
					        <DateTimePicker
					          isVisible={this.state.showPicker}
					          onConfirm={this._handleDatePicked}
					          onCancel={this._hideDateTimePicker}
					          mode={'datetime'}
					        />
					      </View>
					</Grid>
					</Form>
					</Content>

					<Button onPress={()=>{ 
						this.setState({ savePress: true })
						if(this.props.from != 'Productos')
							//Alert.alert('DEBUG', JSON.stringify(this.state.pub.data));
							this.state.pub.push(this.props.navigation) 
						else{
							this.state.pub.update('PUT', 'product', this.state.id, this.props.navigation)
						}
					}}  
					block style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}
					disabled={this.state.savePress}
					>
						
						{
							this.state.savePress ?
								<Text style={{color: "#ffffff"}}> GUARDADO </Text>
							:
								<Text style={{color: this.props.color}}>PUBLICAR</Text>
						}
					</Button>
				
			</View>
		);
	}
}