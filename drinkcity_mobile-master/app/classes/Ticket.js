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

String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase()+this.slice(1);
};

const moment = require('moment');

export default class Ticket extends Model{

	constructor( data = {
		'name': '', 
		'price': 0.00, 
		'stock': 0, 
		'start_date': moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'), 
		'end_date': moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'),
		'users': []
	}){
		super('events/tickets_attributes', data);

		/**
		 * MODELO DE LA TABLA DE PRODUCTOS ALOJADA EN EL SERVIDOR
		 * @type {Array}
		 */
		this.fillable = [
			'type',
			'name', 
			'price',
			'stock',
			'start_date',
			'end_date',
			'users'
		];

		/**
		 * CONFIGURACION DE CADA UNO DE LOS CAMPOS DE LA TABLA DE PRODUCTOS
		 * ALOJADA EN EL SERVIDOR; MANTIENE UN OBJETO COMPUESTO DE OBJETOS CUYOS INDICES
		 * DEL OBJETO ES CADA UNO DE LOS STRINGS DEL ARREGLO DE LOS CAMPOS DEL ARREGLO FILLABLE
		 * CON EL TIPO (PARA SER VALIDADO) Y EL HECHO DE QUE SEA REQUERIDO O NO
		 * @type {Object}
		 */
		this.data_type = {
			type : { type: 'string', required: true, alias: "Tipo de evento" }, 
			name : { type: 'string', required: true, alias: "Titulo del evento" }, 
			price: { type: 'float', required: true, alias: 'Precio de la entrada' },
			stock: { type: 'integer', required: true, alias: 'Disponibilidad' },
			start_date : {type: 'string', required: true, alias:'Fecha Inicial'},
			end_date : {type: 'string', required: true, alias:'Fecha Final'},
			users : {type: 'array', required: true, alias:'Usuarios'}
		}
	}

	/**
	 * METODO PARA VALIDAR Y ENVIAR LOS DATOS AL SERVIDOR
	 * @return boolean RETORNA FALSO SI HA OCURRIDO ALGUN ERROR
	 */
	push(navigation = null, meth = 'POST'){

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
		let resp = super.push('event', meth, navigation);
	}
	getVideoId(){

		if(this.video_link == null || this.video_link == ''){
			return false;
		}
		let id = ( this.data.video_link.search('watch?v=')  != -1) 
			? this.data.video_link.split('watch?v=')
			: this.data.video_link.split('/'); 

		return Array.isArray(id) ? id[1] : false;
	}
}