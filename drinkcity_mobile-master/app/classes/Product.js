/**
 * MODELO DE PRODUCTO
 * @author: GIOVANNY AVILA <gjavila1995@gmail.com>
 * @description : CLASE DESARROLLADA PARA MODELAR LA TABLA DE PRODUCTOS QUE ESTA 
 *              EN EL SERVIDOR Y MINIMIZAR LOS CAMBIOS NECESARIOS CUANDO LA API SEA COMPLETADA
 *
 * 
 */

import Connection from '../config/connection';
import Model from './Model';

import {
	Alert
} from 'react-native'


import { store } from '../redux/store';
import { searchProducts, modelActions } from '../redux/actions';
String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase()+this.slice(1);
};

export default class Product extends Model{

	constructor( data = false){
		super('products', data);

		/**
		 * MODELO DE LA TABLA DE PRODUCTOS ALOJADA EN EL SERVIDOR
		 * @type {Array}
		 */
		this.fillable = [
			'name', 
			'category',
			'description',
			'price',
			'stock',
			'start_datetime',
			'end_datetime',
			'priority',
			'user_id',
			'item_id',
			'item_type'
		];

		/**
		 * CONFIGURACION DE CADA UNO DE LOS CAMPOS DE LA TABLA DE PRODUCTOS
		 * ALOJADA EN EL SERVIDOR; MANTIENE UN OBJETO COMPUESTO DE OBJETOS CUYOS INDICES
		 * DEL OBJETO ES CADA UNO DE LOS STRINGS DEL ARREGLO DE LOS CAMPOS DEL ARREGLO FILLABLE
		 * CON EL TIPO (PARA SER VALIDADO) Y EL HECHO DE QUE SEA REQUERIDO O NO
		 * @type {Object}
		 */
		this.data_type = {
			name : { type: 'string', required: true, alias: "Titulo del aviso" }, 
			category : {type: 'string', required: false, alias: 'Categoria'},
			description: {type: 'string', required: true, alias: 'Detalles'},
			price : {type: 'float', required: true, alias: 'Precio'},
			stock : {type: 'integer', required: true, alias: 'Stock'},
			start_datetime : {type: 'date', required: true, alias:'Fecha de inicio del anuncio'},
			end_datetime : {type: 'date', required: true, alias: 'Fecha de fin del anuncio'},
			priority: {type:'integer', required: true, alias: 'Prioridad de la publicacion'},
			user_id: {type:'integer', required: true, alias: 'Usuario'},
			item_id:  {type:'integer', required: true, alias: 'Tienda'},
			item_type: {type:'string', required: true, alias: 'Tipo de item'}
		}
	}

	/**
	 * METODO PARA VALIDAR Y ENVIAR LOS DATOS AL SERVIDOR
	 * @return boolean RETORNA FALSO SI HA OCURRIDO ALGUN ERROR
	 */
	push(navigation = null){

		// SE CALCULA LA LONGITUD DEL ARREGLO DE CAMPOS DE LA TABLA Y SE 
		// RECORRE EN UN FOR PARA VALIDARLOS
		let data = this.fillable.length;
		for (var i = 0; i < data; i++) {

			//	USANDO LA POSICION DEL STRING DE CADA UNO DE LOS CAMPOS DE LA TABLA
			//	ALMACENADOS EN EL ARRAY FILLABLE Y SE USA PARA VALIDAR EL CAMPO
			//	EN EL OBJETO DATA
			if((this.data[ this.fillable[i] ] == '' && this.fillable[i] != 'priority') && this.data_type[ this.fillable[i] ].required ){
				Alert.alert('Error', '[ '+this.fillable[i]+'] Debe completar todos los campos presentes en el formulario ->'+JSON.stringify(this.data));
				return false;
			}else{
				let type = this.data_type[ this.fillable[i] ].type
				if( !this.valid( type.capitalize(), this.fillable[i] ) ){
					Alert.alert('Error', 'Error de tipo para el dato '+this.data_type[ this.fillable[i] ].alias );
					return false;
				}
			}
		}

		let resp = super.push('product', 'POST', navigation);
	}

	async getAll(user_id = null, token){
		const con = new Connection();
		let url = con.getUrlApi()+'users/'+user_id+'/products';
		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'json',
				Authorization: token
			}
		}).then(resp=>{
			let { _bodyInit } = resp;
			_bodyInit = (typeof(_bodyInit) == 'string') ? JSON.parse(_bodyInit) : _bodyInit;
			store.dispatch(searchProducts(_bodyInit));
		});
	}

	update(method, model, id, navigation){
		let { data } = this;
		if(data.image.search(';base64,') != -1 )
			super.update(method, model, id, navigation);
		else{
			delete data['image'];
			this.data = data;
			super.update(method,model, id, navigation)
		}	
	}
}