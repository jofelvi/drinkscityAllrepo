import React from 'react';
import {
	Row,
	Grid,
	Container,
	Content,
	Col,
	Text,
	View,
	Input,
	Form,
	Item,
	Picker,
	Label,
	Button,
	Thumbnail
} from 'native-base';

import {
	Alert,
	TouchableOpacity,
	ScrollView,
	WebView,
	StatusBar,
	StyleSheet,
	AsyncStorage,
	PermissionsAndroid,
	Keyboard
} from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Event from '../../classes/Event';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Modal from "react-native-modal";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Cropper from '../../classes/Cropper';

import GooglePlacesInput from '../Autocomplete';

const moment = require('moment');

var ImagePicker = require('react-native-image-picker');
var options = {
  title: 'Selecciona una opción',
	takePhotoButtonTitle: 'Tomar desde la camara',
	chooseFromLibraryButtonTitle: 'Elegir una desde la galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class FormEvent extends React.Component{


	static navigationOptions = {
		title: 'CREAR EVENTO',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}


	constructor(props){
		super(props);

		const { navigation } = this.props;

		let event = (navigation.state.params.evento != false) 
					? navigation.state.params.evento
					: new Event({
						'name' : '', 
						'category' :'',
						'address': 'calle 123',
						'video_link': '',
						'start_datetime': moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'),
						'end_datetime': moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'),
						'description': '',
						'user_id': 1,
						'store_id': 0,
						'active': '',
						'longitude': '-',
						'latitude': '-',
						'priority': navigation.state.params.priority
					});

		this.state = {
			...event.data,
			event: event,
			meth: (navigation.state.params.evento != false)  ? 'PUT' : 'POST',
			togleModal: false,
			statusBarColor: "#02A6A4",
			statusBarStyle: 'default',
			currentRegion: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: 0.015,
				longitudeDelta: 0.0121,
			},
			markers: [],
			stores: [],
			images: []
		}
		this.componentWillMount()

	}

	regionFrom(lat, lon, accuracy) {
	    const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
	    const circumference = (40075 / 360) * 1000;

	    const latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
	    const lonDelta = (accuracy / oneDegreeOfLongitudeInMeters);
	    return {
	      latitude: lat,
	      longitude: lon,
	      latitudeDelta: Math.max(0, latDelta),
	      longitudeDelta: Math.max(0, lonDelta),
	    };
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

				let b64Crop = crop.cropping(response.path, 1300, 420);

				setTimeout(()=>{
						image[ (image.length) ] = 'data:image/jpeg;base64,' + b64Crop._55.data; 

						this.setState({
							images: image
						});
				}, 3000)
				 this.state.event.setAttribute('images', this.state.images);
			}
			
		});
	}

	async componentDidMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		let { store } = session;
		this.setState({
			store_id: this.state.event.setAttribute('store_id', store.id)
		});
	}

	async componentWillMount(){
		try{
			const permission = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
					'title': 'Solicitud de permisos para el uso de geolocalizacion',
					'message': `Esta app requiere de permisos especiales para el uso de geolocalizacion`
				}
			);
			if(permission === PermissionsAndroid.RESULTS.DENIED ){
				this.props.navigation.goBack();
			}
		}catch(err){
			console.log(err);
		}
		navigator.geolocation.getCurrentPosition(
		    (position) => {
		    	var { markers } = this.state;
		    	markers[0] = this.regionFrom(
		        		position.coords.latitude, 
		        		position.coords.longitude, 
		        		position.coords.accuracy
		        	);
		    	markers[1] = { ...markers[0] };
		        this.setState({
		        	markers: markers,
		        	currentRegion: {
		        		...markers[0]
		        	}, 
		        	longitude: this.state.event.setAttribute('longitude', markers[0].longitude),
		        	latitude: this.state.event.setAttribute('latitude', markers[0].latitude)
		        })
		    },
		    (error) => alert(error.message),
		    {enableHighAccuracy: false, timeout: 40000, maximumAge: 20000}
		);

		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		this.setState({
			stores: session.stores
		});
	}

	_onDragMarker(coords){
		const { coordinate } = coords.nativeEvent;
		this.setState({
			latitude: this.state.event.setAttribute('latitude', coordinate.latitude),
			longitude: this.state.event.setAttribute('longitude', coordinate.longitude)
		})
	    this._getDirection( 
		    { lat: this.state.latitude, lon: this.state.longitude }, 
		    { lat: this.state.latitude, lon: this.state.longitude } 
		);
	}

	_renderMarkers(){
		let {markers} = this.state;

		const marks = markers.map((data, i) =>{
			if( i > 0)
			{
				return <Marker
						key={i}
						draggable={ (i > 0) } 
						onDragEnd={ coords =>{this._onDragMarker(coords)} } 
						coordinate={{...data}}
					/>
			}
		});

		return marks;
	}

	_showVideoByLink(link = null){
		let video = new String(link);
		let id =  video.split('watch?v=');
		return 'https://youtube.com/embed/'+id[1];
	}

	async _getDirection(origin = null, destination = null){
		this.setState({
			address: 'Cargando direccion...'
		})
		if(origin != null & destination != null){
			fetch(`https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyDVY2in9_CGre6PDYzILjfi_YCSNrgLQRo&origin=${origin.lat+','+origin.lon}&destination=${destination.lat+','+destination.lon}`,{

			}).then(data => {
				let { _bodyInit } = data;
				_bodyInit = ( typeof(_bodyInit) == 'string' ) ? JSON.parse(_bodyInit): _bodyInit;
				let destination = _bodyInit.routes[0].legs[0];
				this.setState({
					address: this.state.event.setAttribute('address', destination.end_address)
				});
			});
	    }else{
	    	this.setState({
	    		address: 'Cargando direccion...'
	    	})
	    }
	}

	_onPressPositionMap(coord){
		var { coordinate } = coord.nativeEvent
		var { markers } = this.state
		markers[1] = {longitude: coordinate.longitude, latitude: coordinate.latitude};
		this.setState({
			markers: markers,
			longitude: this.state.event.setAttribute('longitude', coordinate.longitude),
			latitude: this.state.event.setAttribute('latitude', coordinate.latitude)
		});
	    this._getDirection( 
		    { lat: coordinate.latitude, lon: coordinate.longitude }, 
		    { lat: coordinate.latitude, lon: coordinate.longitude } 
		);
	}

	region(){
		const { markers } = this.state;
		if(markers.length > 1){
			var coords = markers[0];
			return {
				...coords
			};
		}

		return {
			...this.state.currentRegion
		}

	}
	_hideDateTimePicker = () => this.setState({ showPicker: false });

	_handleDatePicked = (date) => {
		let dateParser = ( typeof(date) == 'object' ) ? date: JSON.parse(date);
	   switch(this.state.from){
	   		case 'start_datetime': {
	   			this.setState({ start_datetime:this.state.event.setAttribute('start_datetime', moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')) });
	   			break;
	   		}
	   		case 'end_datetime':{
	   			this.setState({ end_datetime: this.state.event.setAttribute('end_datetime', moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')) })
	   			break;
	   		}
	   }
	   this._hideDateTimePicker();
	};

	_renderImages(){
		let { images, event } = this.state;
		let values = (event && event.data && event.data.images) ? event.data.images : images
		let items = null;
			items = values.map( (data, i)=>{
				return (
					<Col key={i}>
						<View style={{flex: 1, width: "100%", alignContent: "center", alignSelf: "center" , height: 150, marginTop: 10, marginBottom: 3}}>
							<Thumbnail 
								square  
								style={{
									width: "100%",
									height: 160,
									flex: 1
								}}
								source={{uri: (data.cover_url != undefined ) ? data.cover_url : data }} 
							/>
							<View style={{flex:1, position: 'absolute', top: 0, right: 0}}>
								<Button 
									rounded 
									danger 
									style={{elevation: 3, position: "absolute", right: 3}}
									onPress={()=>{
										let notDeletes = this.state.images.filter( (image, k) =>{
											return k != i;
										});
										this.setState({ images: notDeletes  });

									}}
								>
									<FontAwesome style={{color: "#ffffff", fontSize: 15}}>{Icons.close}</FontAwesome>
								</Button>
							</View>
						</View>
					</Col>
				);
			});
		
			return items;
		
	}

	getGoogleDescription = (data, details) =>{
		this.setState({
			address: this.state.event.setAttribute('address', data.description)
		});
		//Alert.alert('DEBUG-ADDRESS', JSON.stringify(data));
	}
	render(){

		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={this.state.statusBarColor} />
				<ScrollView>
					<Content>
					<Form>
						<Grid>
						<Row style={{marginLeft: 7}}>
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
							<Col style={{width: "95%", marginTop: 20}}>
								<Item floatingLabel>
									<Label 
										style={{ color: "#ffffff" }} >Titulo del Evento
									</Label>
									<Input 
										style={{ color: "#ffffff" }}
										onChangeText={ text =>{this.state.event.setAttribute('name',text); this.setState({name: text}) }} 
										value={this.state.name} 
									/>
								</Item>
							</Col>
						</Row>
						<Row style={{ marginTop: 20 }}>
							<Col style={{width: "95%", marginLeft: "2%", borderBottomWidth: 1, borderBottomColor: 'white'}}>
								<Label style={{ color: "#ffffff", marginLeft: 7}}>Categoria</Label>
								<Picker
									mode='dropdown'
									onValueChange={value => { this.state.event.setAttribute('category', value); this.setState({category: value}); }}
									style={{ color: "#ffffff" }}
									selectedValue={this.state.category}
							       	itemStyle={{color: "#ffffff", backgroundColor: 'lightgrey', marginLeft: 0, paddingLeft: 15 }}
							       	itemTextStyle={{ fontSize: 18, color: 'white' }}
								>
									<Item style={{color: "#ffffff" }} label="Seleccione Una Categoria" value={''} />
									<Item style={{color: "#ffffff" }} label="Electronica" value={"electronica"} />
									<Item style={{color: "#ffffff" }} label='Evento Cultural' value={'evento_cultural'} />
									<Item style={{color: "#ffffff" }} label='Tecno' value={'tecno'} />
									<Item style={{color: "#ffffff" }} label='Reggaeton' value={'reggaeton'} />
									<Item style={{color: "#ffffff" }} label='Pub. Bailable' value={'pub_bailable'} />
									<Item style={{color: "#ffffff" }} label='Tecno' value={'tecno'} />
									<Item style={{color: "#ffffff" }} label='Concierto' value={'concierto'} />
									<Item style={{color: "#ffffff" }} label='Hip Hop' value={'hip_hop'} />
									<Item style={{color: "#ffffff" }} label='Musica de los 90' value={'musica_90'} />
									<Item style={{color: "#ffffff" }} label='Musica de los 80' value={'musica_80'} />

									<Item style={{color: "#ffffff" }} label='Otros' value={'otros'} /> 
								</Picker>
							</Col>
						</Row>
						<Grid>
							<Row>
								<Col style={{width: "95%", marginTop: 20}}>
									<Label style={{ color: "#ffffff", marginLeft: 14 }}>Dirección</Label>
									<View style={{marginLeft: 14, alignSelf: "center", alignContent: "center", alignItems: "center", borderBottomWidth:1, borderBottomColor: 'white'}} >
										<GooglePlacesInput onDirectionSelect={this.getGoogleDescription} />
									</View>
								</Col>
							</Row>
						</Grid>
						<Row>
							<Col style={{width: "95%", marginTop: 20}}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Detalles</Label>
									<Input  style={{ color: "#ffffff" }} value={this.state.description} onChangeText={text=>{ this.setState({description: this.state.event.setAttribute('description', text)}); }} multiline={true} numberOfLines={4} />
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{width: "95%", marginTop: 20}}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Video Promocional (Link)</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ video_link =>{ this.setState({ video_link: this.state.event.setAttribute('video_link', video_link) }) }}  
										value={this.state.video_link}
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "95%", marginTop: 20 }}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Fecha y hora del evento</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ event_day =>{ this.setState({ start_datetime: this.state.event.setAttribute('start_datetime', event_day) }) }}  
										value={ moment(this.state.start_datetime ).format('YYYY-DD-MM hh:mm A') }
										onFocus={ event =>{ Keyboard.dismiss(); this.setState({ showPicker: true, from: 'start_datetime' }); } }
										
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "95%", marginTop: 20 }}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Fecha y hora de fin</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ end_datetime =>{ this.setState({ end_datetime: this.state.event.setAttribute('end_datetime', end_datetime) }) }}  
										value={ moment(this.state.end_datetime ).format('YYYY-DD-MM hh:mm A')}
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
						if(this.state.meth == 'PUT')
							this.state.event.update('PATCH','event', this.state.id ,this.props.navigation)
						else{
							this.props.navigation.navigate('Entrada', { event: this.state.event, action: 'POST', address: this.state.address, start_datetime: this.state.start_datetime, end_datetime: this.state.end_datetime })
						}
					}}  block style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}>
						<Text style={{color: "#ffffff"}}>CONTINUAR</Text>
					</Button>
				</ScrollView>
				<View>
			        <Modal isVisible={this.state.togleModal} backdropColor={'transparent'} >
			          <View style={{ flex: 1, position: 'relative' }}>
			            <TouchableOpacity 
			            	style={{
			            		alignSelf: "flex-end"
			            	}}
			            	onPress={()=>{
			            		this.setState({togleModal: !this.state.togleModal});
			            		this.setState({ 
			            			statusBarColor: "#02A6A4"
			            		});
			            	}}
			            >
			            	<Text>
			            		<FontAwesome style={{fontSize: 26}}>{Icons.close}</FontAwesome>
			            	</Text>
			            </TouchableOpacity>
					      <View style ={styles.containerMap}>
					        <MapView
					          style={styles.map}
					          initialRegion={this.state.currentRegion}
					          onPress={ point => this._onPressPositionMap(point)  }
					        >
								<Marker   
									coordinate={{...this.state.currentRegion}}
								/>
					        	{this._renderMarkers()}
					        </MapView>
					      </View>
			          </View>

			        </Modal>
		      </View>
			</View>
		);
	}
}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	},
	  containerMap: {
	    ...StyleSheet.absoluteFillObject,
	    height: 400,
	    width: 400,
	    justifyContent: 'flex-end',
	    alignItems: 'center',
	    marginTop: "10%"
	  },
	  map: {
	    ...StyleSheet.absoluteFillObject,
	  },
}