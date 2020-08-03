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

export default class Event extends Model{

	constructor( data = false){
		super('events', data);

		/**
		 * MODELO DE LA TABLA DE PRODUCTOS ALOJADA EN EL SERVIDOR
		 * @type {Array}
		 */
		this.fillable = [
			'name', 
			'category',
			'address',
			'video_link',
			'start_datetime',
			'end_datetime',
			'description',
			'user_id',
			'store_id',
			'priority',
			'active',
			'longitude',
			'latitude'
		];

		/**
		 * CONFIGURACION DE CADA UNO DE LOS CAMPOS DE LA TABLA DE PRODUCTOS
		 * ALOJADA EN EL SERVIDOR; MANTIENE UN OBJETO COMPUESTO DE OBJETOS CUYOS INDICES
		 * DEL OBJETO ES CADA UNO DE LOS STRINGS DEL ARREGLO DE LOS CAMPOS DEL ARREGLO FILLABLE
		 * CON EL TIPO (PARA SER VALIDADO) Y EL HECHO DE QUE SEA REQUERIDO O NO
		 * @type {Object}
		 */
		this.data_type = {
			name : { type: 'string', required: true, alias: "Titulo del evento" }, 
			category : {type: 'string', required: false, alias: 'Categoria'},
			address: {type: 'string', required: true, alias: 'Direccion del evento'},
			video_link : {type: 'string', required: false, alias: 'Video de presentacion'},
			start_datetime : {type: 'string', required: false, alias:'Fecha del evento'},
			end_datetime : {type: 'string', required: false, alias:'Fecha finalizacion del evento'},
			user_id: {type:'integer', required: true, alias: 'Usuario'},
			priority: {type:'string', required: false, alias: 'Nivel de prioridad'},
			store_id:  {type:'integer', required: true, alias: 'Tienda'},
			description: {type: 'string', required: true, alias: 'Los detalles del evento no pueden quedar en blanco'},
			active: {type: 'string', required: false, alias: 'Estado del evento'},
			longitude: {type: 'string', required: false, alias: 'Longitud geografica del evento' },
			latitude: {type: 'string', required: false, alias: 'Latitud geografica del evento' }
		
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