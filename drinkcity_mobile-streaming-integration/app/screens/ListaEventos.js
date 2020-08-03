import React from 'react';
import {
	Container,
	Content,
	View,
	Text,
	List,
	ListItem,
	Label,
	Fab,
	Button,
	Body,
	Left,
	Right,
	CardItem,
	Card,
	Col
} from 'native-base';

 
import {
	Dimensions,
	StatusBar,
	Alert,
	ScrollView,
	WebView,
	TouchableOpacity,
	Image,
	AsyncStorage
} from 'react-native';

import YouTube from 'react-native-youtube'
import { MenuProvider } from 'react-native-popup-menu';
import { PopMenu } from '../components/PopupMenu'

import FontAwesome, {Icons} from 'react-native-fontawesome';
import Connection from '../config/connection'
import Event from '../classes/Event';
import { store } from '../redux/store';

var BackHandler = require('BackHandler')

export default class ListaEventos extends React.Component{

	static navigationOptions = ({navigation}) => ({
		title: `MIS EVENTOS`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	})

	constructor(props){
		super(props);
		this.state = {
			active: false,
			eventos: [],
			menuActive :false,
			store: null,
			tipos: {
				"electronica": "Electronica" ,
				"evento_cultural": 'Evento Cultural',
				"otros": 'Otros'
			}
		}

		store.subscribe( ()=> {
			let events = [];
			for (var i = 0 - 1; i <store.getState().eventos.length; i++) {
				events[i] = ( ! (store.getState().eventos[i] instanceof Event) ) 
							? new Event(store.getState().eventos[i])
							: store.getState().eventos[i];
			}
			this.setState({
				eventos: events
			});
			//Alert.alert('DE', JSON.stringify(this.state.eventos[5].data.store))
		});

	}

	async componentDidMount(){
		let session = await AsyncStorage.getItem('@session');
		let { store } = await JSON.parse(session);
		this.setState({
			store
		});
		//Alert.alert('DEBUG', JSON.stringify(this.state.store));
	}

	componentWillMount(){
		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
		let ev = new Event();
		ev.getAll();
	}

	_showVideoByLink(link = null){
		let video = new String(link);
		let id = video.split('watch?v=');
		return id[0]+'embed/'+id[1];
	}


	_onUpdate = (data) =>{
		let events = this.state.eventos.map((event) =>{
			if(event.data.id == data.id)
				return new Event(data);
			return event;
		});

		this.setState({
			eventos: events
		});
	}

	_onUpdateButtonPress = (evento) => {

		this.props.navigation.navigate('FormEvent', { evento, priority: evento.data.priority, onUpdate: this._onUpdate })
	}

	_loadUrlImageResource(toLoad){
		const con = new Connection();

		var url = null;
		if( Array.isArray(toLoad.images.self) && toLoad.images.self.length > 0 ){
			url = toLoad.images.self[0].cover_url;
			//Alert.alert('URL', url);
		}

		//Alert.alert('DEBUG', toLoad.id+' -> '+url);
		return url;
	}

	_onDelete = ( evento ) =>{
		let events = this.state.eventos.filter((event, i)=>{
			return evento.data.id != event.data.id
		});

		this.setState({
			eventos: events
		});

		del = ( evento instanceof Event ) ? evento : new Event(evento);
		del.delete();

	}


	_renderList(){
		let con =new Connection();
		let { tipos } = this.state;
		let { store } = this.state;
		if(store !== null){
			const items = this.state.eventos.map( (data, i)=>{
				let datos = data.data;
				//Alert.alert('data', JSON.stringify(datos)+ ' -> '+JSON.stringify(store));
				if(datos.store.id == store.id){
					return(
							<Card key={i} style={{ width: "99%", borderColor: "#01DAC9", borderWidth: 1, backgroundColor: "#111111" }} >
								<CardItem style={{backgroundColor: "#111111"}}>
									<Left />
									<Body />
									<Right>
										<PopMenu navigation={this.props.navigation} onDelete={this._onDelete}  model={'events'} onUpdatePress={this._onUpdateButtonPress} onUpdate={this._onUpdate}  navigation={this.props.navigation} evento={data} eventos={this.state.eventos} />
									</Right>
								</CardItem>
								<CardItem button onPress={()=>this.props.navigation.navigate('EventoDetalle', { evento: data })} cardBody style={{backgroundColor: "#111111"}}>
									<Image 
										source={{uri: this._loadUrlImageResource(data.data) }}
										style={{
											width: "100%",
											height: 220,
											flex: 1
										}}
									/>
								</CardItem>
								<CardItem button onPress={()=>this.props.navigation.navigate('EventoDetalle', { evento: data })} style={{backgroundColor: "#111111"}}>
									<Col>
										<Text selectable={true} style={{color: "#ffffff",textAlign: "center", width: "100%", fontSize: 17,}}>
											{data.data.name}
										</Text>
										<Text selectable={true} style={{color: "#ffffff",textAlign: "center", width: "100%", fontSize: 17,}}>
											{tipos[data.data.category]}
										</Text>
									</Col>
								</CardItem>
							</Card>
					);
				}
			});
			return items;
		}
		return null;
		
	}

	render(){
		return(
			<MenuProvider>
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<ScrollView>
					{this._renderList()}
				</ScrollView>
		        <View style={{ flex: 1 }}>
		          <Fab
		            containerStyle={{ }}
		            style={{ backgroundColor: '#02A6A4' }}
		            position="bottomRight"
		            onPress={() =>  this.props.navigation.navigate(`FormsEvents`,{meth: 'POST', titulo: 'Listado de eventos publicados', side: 'Home', event: false}) }>
		            <Text style={{color:"#ffffff", fontSize: 20}}>
		            	<FontAwesome style={{color:"#ffffff", fontSize: 20}}>{Icons.plus}</FontAwesome>
		            </Text>
		          </Fab>
		        </View>
			</View>
			</MenuProvider>
		);
	}
}


const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	}
}