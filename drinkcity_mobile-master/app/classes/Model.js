import Connection from '../config/connection';
import {
	Alert,
	AsyncStorage
} from 'react-native';

import { store } from '../redux/store';
import { searchProducts, modelActions } from '../redux/actions';
import { funcionarios } from '../redux/actions';
import BackHandler from 'BackHandler';

const moment = require('moment');
const RNFS = require('react-native-fs');
var path = '/storage/Download/log_update.txt';

export default class Model{


	constructor( model, data = false){

		this._model = model;

		if( typeof data != 'boolean')
			this.data = {
				...data
			};

		else
			this.data = false;

		this.newCollection = [];
		store.subscribe(()=>{
			this.newCollection = store.getState()
		})

	}

	getData(){
		return this.data;
	}

	_createCollection( collection ){

		for(object in collection){
			this.newCollection.push( (new Model( this._model, collection[parseInt(object)]) ) );
		}
		return this.newCollection;

	}

	async _getAuthorization(){
		
		this._saveToken(token.token);
	 		
	}

	_saveToken(token){

	}

	_validSessionOrKill(resp, navigation = null){
		let  _bodyInit  = JSON.parse(resp._bodyInit);
		//Alert.alert('D-4', JSON.stringify(resp))
		if( resp.status == undefined || resp._bodyInit.token == 'Invalid token' || resp.status == 401 || _bodyInit.error == 'Not Authorized' ){
			if( navigation !== null ){
				navigation.navigate('RootScreen');
				return false;
			}
			BackHandler.exitApp();
		}
	}
	async _getRequest( navigation = null ){

		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);
		let connection = new Connection;
		let url = connection.getUrlApi(this._model);
		let data = await fetch( url, {
			method: 'GET',
			headers:{
				Accept: 'application/json',
				Authorization:token.token
			}
		} ).then( data =>{ 
			let valid = this._validSessionOrKill(data, navigation);
			return JSON.parse(data._bodyInit);
		} ).then( data => data	 );

		store.dispatch(searchProducts(data));
	}

	allToRedux(){
		try{
			this._getRequest();
		}catch(err){
			console.log(err);
		}
	}

	getAttribute(attr){

		return this.data[attr];
	}

	setAttribute(attr, newValue){

		this.data[attr] = newValue;
		return this.getAttribute(attr);
	}

	_validStringAttribute(attribute){

		return true;
	}

	_validIntegerAttribute(attribute){
		return !isNaN( parseFloat( this.data[attribute] ) ) && isFinite(this.data[attribute]);
	}

	_validFloatAttribute(attribute){
		return this._validIntegerAttribute(attribute);
	}

	_validDateAttribute(attribute){
		format1 = moment( this.data[attribute] , 'DD-MM-YYYY');
		format2 = moment( this.data[attribute] , 'YYYY-MM-DD');
		format3 = moment( this.data[attribute] , 'YYYY-MM-DD HH:mm A');
		format4 = moment( this.data[attribute] , 'YYYY-MM-DD hh:mm A');
		format5 = moment( this.data[attribute] , 'YYYY-MM-DD HH:mm a');
		format6 = moment( this.data[attribute] , 'YYYY-MM-DD hh:mm a');


		return (
				format1.isValid() || 
				format2.isValid() || 
				format3.isValid() || 
				format4.isValid() || 
				format5.isValid() ||
				format6.isValid()
			);
	}

	_validTimeAttribute(attribute){
		hora1 = moment( this.data[attribute] , 'HH:mm:ss');
		hora2 = moment( this.data[attribute] , 'HH:mm:ss'); 
		hora3 = moment( this.data[attribute] , 'hh:mm:ss a'); 
		hora4 = moment( this.data[attribute] , 'hh:mm:ss A'); 

		return ( hora1.isValid() || hora2.isValid() || hora3.isValid() || hora4.isValid() );
	}

	valid(type, attribute){
		return eval(`this._valid${type}Attribute('${attribute}')`);
	}

	async push(param, method = 'GET', navigation = null ,exito ='Los datos han sido guardados correctamente', error = 'Ha ocurrido un error al intentar guardar los datos'){


		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);

		let connection = new Connection;

		let json = JSON.stringify(this.data)
		const body = '{"'+param+'":'+json+'}';

		return await fetch( connection.getUrlApi(this._model), {
			method,
			headers:{
				'Content-Type': 'application/json',
				Accept: 'json',
				Authorization: token.token
			},
			body: body
		}).then( resp => {
			let valid = this._validSessionOrKill(resp, navigation);
			data = resp;
			if((data.status == 200 || data.status == '200') || (data.status = '201' || data.status == 201)){
				Alert.alert('Confirmacion', 'Los datos han sido guardados correctamente ', [
					{
						text: 'Aceptar',
						onPress: ()=>{ 
							if(navigation != null)
								navigation.goBack()
							return false;
						}
					}
				]);
			}
			else
			{
				Alert.alert('Error', 'Ha ocurrido un error inesperado', [
					{
						text: 'Aceptar',
						onPress: ()=> { navigation.goBack(); }	
					}
				]);
			}

		});
	}

	async getAll(navigation = null, param){

		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);

		const con = new Connection();
		let url = con.getUrlApi(this._model);
		let req = await fetch(`${url}?user_id=${param}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: token.token
			}
		}).then( resp =>{
			if(resp.status == 200 || resp.status == '200'){
				//Alert.alert("RESPOSE", resp._bodyInit);
				return JSON.parse(resp._bodyInit);
			}
			navigation.navigate('RootScreen')

		});

		store.dispatch(modelActions(req, this._model));
	}


	async getAllRrpp(navigation = null){

		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);
		// let user = await JSON.parse(session);

		// alert(token.user.id);

		const con = new Connection();
		let url = con.getUrlApi('rrpp_events');
		let req = await fetch(`${url}?user_id=${token.user.id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: token.token
			}
		}).then( resp =>{
			if(resp.status == 200 || resp.status == '200'){
				//Alert.alert("RESPOSE", resp._bodyInit);
				return JSON.parse(resp._bodyInit);
			}
			navigation.navigate('RootScreen')

		});

		store.dispatch(modelActions(req, 'rrpp_events'));
	}

	async getAllGuests(navigation = null, event_id){

		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);

		const con = new Connection();
		let url = con.getUrlApi('guests');
		let req = await fetch(`${url}?event_id=${event_id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: token.token
			}
		}).then( resp =>{
			if(resp.status == 200 || resp.status == '200'){
				// Alert.alert("RESPOSE", resp._bodyInit);
				return JSON.parse(resp._bodyInit);
			}
			navigation.navigate('RootScreen')

		});

		store.dispatch(modelActions(req, 'guests'));
	}



	async delete(method = 'DELETE', navigation = null){



		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);
		const con = new Connection();
		let url = con.getUrlApi(this._model)+'/'+this.data.id;

		var req = await fetch(con.getUrlApi(this._model)+'/'+this.data.id, {
			method,
			headers:{
				Accept: 'application/json',
				Authorization: token.token,
				'Content-Type': 'application/json'
			}
		}).then( resp =>{
			let valid = this._validSessionOrKill(resp, navigation);
			if(resp.status = 200 || resp.status == '200')
				Alert.alert('Accion realizada', 'El usuario ha sido eliminado de manera correcta'); 
			else
				Alert.alert('Error', 'Ha ocurrido un error al intentar eliminar el usuario'); 
		} );

	}

	async update(method = 'PUT', model='user', id=undefined ,navigation = null){


		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);

		const con = new Connection();

		let params = '{ "'+model+'" : '+JSON.stringify(this.data)+' }';
		let req = await fetch(con.getUrlApi(this._model)+'/'+id, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token.token
			},
			body: params
		}).then(resp => {
			const { _bodyInit } = resp;
			//Alert.alert('UPDATE-MODEL', JSON.stringify(resp));
			//let valid = this._validSessionOrKill(resp, navigation);

			if(resp.status == '200' || resp.status == 200 || resp.status == '201' || resp.status == 201){
				Alert.alert('Correcto', 'Los datos han sido actualizados correctamente', [
					{
						text: 'Aceptar',
						onPress:()=>{ 
							//navigation.state.params.onUpdate(resp._bodyInit);
							//navigation.goBack();
						}
					}
				]);
			}
			else{
				Alert.alert('Error', 'A ocurrido un error inesperado -> '+JSON.stringify(resp)+' -> '+params);
			}
		});

	}

	static async getWithId(model , id = null, navigation = null){



		let session = await AsyncStorage.getItem("@session");
		let token = await JSON.parse(session);
		con = new Connection();
		let url = ( id != null ) ? con.getUrlApi(model)+'/'+id : con.getUrlApi(model);

		let resp = fetch( url, {
			method: 'GET',
			headers:{
				Accept: 'application/json',
				Authorization: token.token
			}
		}).then( (resp)=>{
			return resp._bodyInit;
		}).catch( err => {
			return err
		})

		return resp;
	}
}
