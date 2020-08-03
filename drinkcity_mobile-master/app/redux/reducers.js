import {
	Alert
} from 'react-native';

const initialState = {
	products: [],
	funcionarios: [],
	invitados: []
}

const reducer = function( state = initialState, action ){

	let newState = state;

	if( action.type == 'PRODUCTS' ){	
		newState.products = action.products.map((dato) => {
					return dato;
				});
	}

	if( action.type == 'BUSCAR_FUNCIONARIOS' ){
		return { ...state, users: action.funcionarios };
	}

	if(action.type == 'LOAD_EVENTS'){	
		return { ...state, eventos: action.funcionarios }
	}

	if(action.type == 'LOAD_EVENTS_RRPP'){	
		return { ...state, eventos: action.funcionarios }
	}

	if (action.type == 'LOAD_GUESTS') {
		return { ...state, invitados: action.funcionarios }
	}

	return newState;
}


export {
	reducer
}