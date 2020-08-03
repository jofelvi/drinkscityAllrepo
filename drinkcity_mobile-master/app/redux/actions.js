import {
	Alert
} from 'react-native';

const searchProducts = function(products = []){

	return {
		type: 'PRODUCTS',
		products
	};
}

const funcionarios = (funcionarios = []) =>{
	return {
		type: 'BUSCAR_FUNCIONARIOS',
		funcionarios
	}
}

const modelActions = (funcionarios = [], model = null) =>{

	if( model == 'users' ){
		return {
			type: 'BUSCAR_FUNCIONARIOS',
			funcionarios
		};
	}

	if( model == 'events' ){
		let funcs = {
			type: 'LOAD_EVENTS',
			funcionarios
		}
		return funcs;
	}

	if( model == 'rrpp_events' ){
		let funcs = {
			type: 'LOAD_EVENTS_RRPP',
			funcionarios
		}
		return funcs;
	}

	if (model == 'guests') {
		let funcs = {
			type: 'LOAD_GUESTS',
			funcionarios
		}
		return funcs;
	}
}


export {
	searchProducts,
	funcionarios,
	modelActions
}