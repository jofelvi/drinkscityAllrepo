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
import MultiSelect from 'react-native-multiple-select';
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

export default class Entrada extends React.Component{


	static navigationOptions = ({navigation}) => ({
		title: `ENTRADAS`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" },
	});


	constructor(props){
		super(props);
		pub = new Ticket();
		this.state = {
			stores: [],
			funcionarios: [],
			selectedItems: [],
			pub,
			type: '',
			con: new Connection(),
			showPicker: false,
			from: '',
			ref_startdatetime: null,
			ref_enddatetime: null,
			event: null,
			savePress: false,
			price: 0.00,
			stock: 0.00,
			start_date: moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'),
			end_date: moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'),
		};

	}

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems: this.state.pub.setAttribute('users', selectedItems)});
  };

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
						image[ (image.length) ] = 'data:image/jpeg;base64,' + b64Crop._55.data; 

						this.setState({
							images: image
						});
				}, 3000)
				 
				
				this.setState({
					images: this.state.images
				});
			}
			
		});
	}

	async saveTicket(){
		let con = new Connection();
		let { event } = this.props.navigation.state.params;
		let session = await AsyncStorage.getItem('@session');
		let { token } = await JSON.parse(session);

		// let body= `{ "ticket": { "name": "${this.state.name}", "start_date": "${this.state.start_date}", "end_date": "${this.state.end_date}", "price": ${this.state.price}, "stock": ${this.state.stock}, "event_id": ${event.data.id}, "users": ${JSON.stringify(this.state.selectedItems)} } } `;
		let body = {
			ticket: {
				name: this.state.name,
				start_date: this.state.start_date,
				end_date: this.state.end_date,
				price: this.state.price,
				stock: this.state.stock,
				event_id: event.data.id,
				users: this.state.selectedItems
			}
		}
		let request =await fetch( con.getUrlApi('tickets'), {
			method: 'POST',
			headers: {
				Authorization:token.token,
				'Content-Type': 'application/json',
				Accept: 'json'
			},
			body: JSON.stringify(body)
		} ).then(resp => {
			if(resp.status == 200 || resp.status== '200' || resp.status == 201 || resp.status == '201'){
				Alert.alert('Confirmacion', 'La entrada ha sido creada de manera correcta',[
					{
						text: 'Aceptar',
						onPress: ()=>{ this.props.navigation.goBack(); }
					}
				]);
			}
		});
		this.setState({
			savePress: false
		});
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		let { state } = this.props.navigation
		this.setState({
			event: state.params.event
		});
		//Alert.alert('D-2', JSON.stringify(state.params.event.data))
	}


	async componentDidMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
		let session = await AsyncStorage.getItem('@session');
		let { token } = await JSON.parse(session);
		session = await JSON.parse(session);
		let { store } = session;

		let con = new Connection();
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
					funcionarios: users.filter( item => item.role == 'rrpp')
				});
				// Alert.alert('DEBUG', JSON.stringify(this.state.funcionarios))
			}

		});
		
	}
	_hideDateTimePicker = () => this.setState({ showPicker: false });

	_handleDatePicked = (date) => {
		let dateParser = ( typeof(date) == 'object' ) ? date: JSON.parse(date);
	   switch(this.state.from){
	   		case 'start_date': {
	   			this.setState({ start_date:this.state.pub.setAttribute('start_date', moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')) });
	   			break;
	   		}
	   		case 'end_date':{
	   			this.setState({ end_date: this.state.pub.setAttribute('end_date', moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')) })
	   			break;
	   		}
	   }
	   this._hideDateTimePicker();
	};

	render(){
		const { selectedItems } = this.state;
		return(
			<View style={styles.container}>
				<Content style={{backgroundColor: '#111111'}}>
					<Form>
						<Grid>
						<Row style={{ marginTop: 5 }}>
							<Col style={{width: "95%", marginLeft: "2%"}}>
								<Label style={{ color: "#ffffff", marginLeft: 7 }}>Tipo Entrada</Label>
								<Picker
									mode='dropdown'
									onValueChange={value => { this.state.pub.setAttribute('type', value); this.setState({type: value}); }}
									style={{ color: "#ffffff" }}
									selectedValue={this.state.type}
							       	itemStyle={{color: "#ffffff", backgroundColor: 'lightgrey', marginLeft: 0, paddingLeft: 15 }}
							       	itemTextStyle={{ fontSize: 18, color: 'white' }}
								>
									<Item style={{color: "#ffffff" }} label="Seleccione Un Tipo" value={''} />
									<Item style={{color: "#ffffff" }} label="Normal" value={"normal"} />
									<Item style={{color: "#ffffff" }} label='Cortesia' value={'cortesia'} />
								</Picker>
							</Col>
						</Row>
						<View >
						{
							this.state.type == 'cortesia' &&
							<Row>
								<Col style={{width: "92%", marginLeft: 17}}>
					        <MultiSelect
					          hideTags
					          items={this.state.funcionarios}
					          uniqueKey="id"
					          fontSize={17}
					          textColor={"white"}
					          ref={(component) => { this.multiSelect = component }}
					          onSelectedItemsChange={this.onSelectedItemsChange}
					          selectedItems={selectedItems}
					          selectText="Funcionarios"
					          searchInputPlaceholderText="Buscar..."
					          onChangeInput={ (text)=> console.log(text)}
					          // altFontFamily="ProximaNova-Light"
					          tagRemoveIconColor="#CCC"
					          tagBorderColor="#CCC"
					          tagTextColor="#CCC"
					          selectedItemTextColor="#CCC"
					          selectedItemIconColor="#CCC"
					          itemTextColor="#000"
					          displayKey="fullname"
					          searchInputStyle={{ color: 'white', backgroundColor: '#111111' }}
					          submitButtonColor="#CCC"
					          submitButtonText="Aceptar"
					        />
										{
										   this.multiselect
										    ? 
										   this.multiSelect.getSelectedItemsExt(selectedItems)
										    :
										    null
										}
						    	</Col>
					    	</Row>
						}
						</View>

						<Row>
							<Col style={{width: "98%"}}>
								<Item floatingLabel>
									<Label 
										style={{ color: "#ffffff" }} >Nombre de la entrada
									</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ text =>{this.state.pub.setAttribute('name',text); this.setState({name: text}) }} 
										value={this.state.name} 
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "49%" }} >
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Stock</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ stock =>{ this.setState({ stock: this.state.pub.setAttribute('stock', stock) }) }}  
										value={this.state.stock+""}
									/>
								</Item>
							</Col>
							<Col style={{width: "49%"}}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>{this.state.type == 'cortesia' ? "Precio $0" : "Precio $"}</Label>
									<Input 
										disabled={this.state.type == 'cortesia' ? true : false}
										style={{ color: "#ffffff" }} 
										onChangeText={ price =>{ this.setState({ price: this.state.pub.setAttribute('price', price) }) }}  
										value={this.state.price+""}
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "95%" }}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Fecha inicial</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ event_day =>{ this.setState({ start_date: this.state.pub.setAttribute('start_date', event_day) }) }}  
										value={ moment(this.state.start_date ).format('YYYY-DD-MM hh:mm A') }
										onFocus={ event =>{ Keyboard.dismiss(); this.setState({ showPicker: true, from: 'start_date' }); } }
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "95%" }}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Fecha final</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ end_date =>{ this.setState({ end_date: this.state.pub.setAttribute('end_date', end_date) }) }}  
										value={ moment(this.state.end_date ).format('YYYY-DD-MM hh:mm A')}
										onFocus={ event =>{ Keyboard.dismiss(); this.setState({ showPicker: true, from: 'end_date' }); } }
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

					<Button 
						onPress={()=>{
							this.setState({ savePress: true })
							if(this.props.navigation.state.params.action == 'POST'){
								// alert("if")
								this.setState({
									tickets_attributes: this.state.event.setAttribute('tickets_attributes', [this.state.pub.data])
								})
								// Alert.alert('D-3', JSON.stringify(this.state.event.data));
						 		this.state.event.push(this.props.navigation, 'POST'); 
							}
						 	else{
						 		// alert("else")
						 		this.saveTicket();
								//Alert.alert('D-3', JSON.stringify(event.data.tickets));
						 	}
						}}  
						block 
						disabled={this.state.savePress}
						style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}
					>
						{
							this.state.savePress ?
								<Text style={{color: "#ffffff"}}> CARGANDO </Text>
							:
								<Text style={{color: "#ffffff"}}> PUBLICAR </Text>
						}
					</Button>
				
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