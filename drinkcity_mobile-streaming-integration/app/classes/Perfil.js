import Connection from '../config/connection';
import Model from './Model';

String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase()+this.slice(1);
};

export default class PerfilEmpresa extends Model{

	constructor(perfil = false){
		super('users', perfil);
	}

	getProfileData(){
		return super.getData();
	}

}