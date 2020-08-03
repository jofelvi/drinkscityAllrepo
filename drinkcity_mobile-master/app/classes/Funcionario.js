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

export default class Funcionario extends Model{

	constructor( data = false){
		super('users', data);

		/**
		 * MODELO DE LA TABLA DE PRODUCTOS ALOJADA EN EL SERVIDOR
		 * @type {Array}
		 */
		this.fillable = [
			'fullname', 
			'email',
			'password',
			'phone',
			'role',
			'rut',
			'store_id'
		];

		/**
		 * CONFIGURACION DE CADA UNO DE LOS CAMPOS DE LA TABLA DE PRODUCTOS
		 * ALOJADA EN EL SERVIDOR; MANTIENE UN OBJETO COMPUESTO DE OBJETOS CUYOS INDICES
		 * DEL OBJETO ES CADA UNO DE LOS STRINGS DEL ARREGLO DE LOS CAMPOS DEL ARREGLO FILLABLE
		 * CON EL TIPO (PARA SER VALIDADO) Y EL HECHO DE QUE SEA REQUERIDO O NO
		 * @type {Object}
		 */
		this.data_type = {
			fullname : { type: 'string', required: true, alias: "Nombre" }, 
			email : {type: 'string', required: true, alias: 'Correo electronico'},
			password: {type: 'string', required: true, alias: 'Clave'},
			phone : {type: 'string', required: true, alias: 'Numero telefonico'},
			type : {type: 'integer', required: true, alias: 'tipo'},
			rut: {type: 'string', required: true, alias: 'Rut'},
			role: {type: 'string', required: true, alias: 'Rol'},
			store_id: {type: 'integer', required: true, alias: 'Tienda'}
		}

		this.roles = [
			{name: 'validator', description: 'Validador'},
			{name: 'rrpp', description: 'RRPP'}
		];
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
			if(this.data[ this.fillable[i] ] == '' && this.data_type[ this.fillable[i] ].required ){
				Alert.alert('Error', 'Debe completar todos los campos presentes en el formulario');
				return false;
			}else{
				let type = this.data_type[ this.fillable[i] ].type
				if( !this.valid( type.capitalize(), this.fillable[i] ) ){
					Alert.alert('Error', 'Error de tipo para el dato '+this.data_type[ this.fillable[i] ].alias );
					return false;
				}
			}
		}

		super.push('user','POST', navigation);
	}

	getFillables(){
		return this.fillable;
	}

	getRoles(){
		return this.roles;
	}
}