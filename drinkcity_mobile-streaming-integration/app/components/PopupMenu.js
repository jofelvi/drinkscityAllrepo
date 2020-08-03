
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {
	View,
	Text,
	Alert
} from 'react-native';

import React from 'react';
import FontAwesome, {Icons} from 'react-native-fontawesome'
import { store } from '../redux/store';
import { modelActions } from '../redux/actions';

export class PopMenu extends React.Component {

	constructor(props){
		super(props);
	}

	menuEvents(){
		if(this.props.model == 'events'){
			let { state } =this.props.navigation;
			return(
				<View>
			        <MenuOption 
			        	onSelect={()=>{ this.props.navigation.navigate('Estandar',{from: 'events',product: false,item_type: 'Events', tipo: "ESTANDAR", titulo: "PRODUCTOS POR EVENTO", dato: false, priority: 0}) }} 
			        >
			        	<Text style={{fontSize: 21}}>Crear producto</Text>
			        </MenuOption>
			        <MenuOption 
			        	onSelect={()=>{ this.props.navigation.navigate('Entrada',{from: 'events',event: this.props.evento, action: 'PUT' ,item_type: 'Events', tipo: "ESTANDAR", titulo: "PRODUCTOS POR EVENTO", dato: false, priority: 0}) }} 
			        >
			        	<Text style={{fontSize: 21}}>Crear entradas</Text>
			        </MenuOption>
			        <MenuOption 
			        	onSelect={()=>{ this.props.navigation.navigate('ProductoEvento',{from: 'events',event: this.props.evento, action: 'PUT' ,item_type: 'Events', tipo: "ESTANDAR", titulo: "PRODUCTOS POR EVENTO", dato: false, priority: 0}) }} 
			        >
			        	<Text style={{fontSize: 21}}>Adicionar producto</Text>
			        </MenuOption>
		        </View>
			);
		}
	}

	render(){
		return(
		  <View>
		    <Menu>
		      <MenuTrigger >
		      	<Text>
		      		<FontAwesome style={{color:"#02A6A4", fontSize: 24}}>{Icons.angleDown}</FontAwesome>
		      	</Text>
		      </MenuTrigger>
		      <MenuOptions>
		        <MenuOption 
		        	onSelect={()=>{ this.props.onUpdatePress(this.props.evento); }} 
		        >
		        	<Text style={{fontSize: 21}}>Editar</Text>
		        </MenuOption>
		        {this.menuEvents()}
		        <MenuOption 
		        	onSelect={()=>{
		        		Alert.alert('Advertencia', '¿Esta completamente seguro de eliminar esto?', [
			        		{
			        			text: 'Aceptar',
			        			onPress: ()=>{ 
			        				this.props.onDelete(this.props.evento);
			        			}	
			        		},
			        		{
			        			text: 'Cancelar'
			        		}
		        		]);
		        		
		        	 }} 
		        >
		        	<Text style={{fontSize: 21}}>Eliminar</Text>
		        </MenuOption>
		      </MenuOptions>
		    </Menu>
		  </View>

		);
	}
}