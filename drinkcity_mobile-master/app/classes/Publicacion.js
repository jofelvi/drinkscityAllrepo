import {
	Alert
} from 'react-native'

export default class Publicacion{

	constructor(datos = false){
		if(datos !== false)
			this.datos = {
				...datos
			}
	}

	getTituloAviso(){
		return this.datos.name;
	}

	setTituloAviso( newTitle ){
		this.datos.name = newTitle;
	}

	setCategoriaId(id){
		this.datos.category = id;
		return id;
	}

	getCategoriaId(){
		return this.datos.category;
	}

	setDescripcion(text){
		this.datos.description = text;
	}

	setStock(stock){
		this.datos.stock = stock;
		return stock;
	}


	setPrecio(precio){
		this.datos.price = precio;
	}

	setFechaInicio(fecha){
		this.datos.fecha_inicio = fecha;
		return fecha;
	}
	
	setFechaFin(fecha){
		this.datos.fecha_fin = fecha;
		return fecha;
	}
}