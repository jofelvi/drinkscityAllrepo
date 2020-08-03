import React, { Component } from 'react';
import {
	Alert,
	StatusBar,
	ScrollView
} from 'react-native';

import {
	View,
	Container,
	Row,
	Col,
	Grid,
	Text,
	Card,
	CardItem,
	H3,
	Left
} from 'native-base';


import { 
	VictoryBar ,
	VictoryChart,
	VictoryTheme
} from 'victory-native';

export default class Graphics extends Component{

	static navigationOptions = ({navigation})=> ({
		title:  'GRAFICOS DE VENTA',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	});

	constructor(props){
		super(props);
		this.state ={
			data: []
		};
	}

	renderCategories(){
		const { products } = this.props.navigation.state.params
		var categories = [];

		products.map( (product, i)=>{
			if(product != null && i <= 7){
				categories.push(product.name);
			}
		});

		return categories;
	}

	componentWillMount(){
		const { products } = this.props.navigation.state.params;
		let len = products.length;

		for(let i = 0; i< len; i++){

			if( products[i] != null ){
				for(let j=0; j< len; j ++){
					if( products[j] == null  && j < i){
						let aux = products[j];
						products[j] = products[i];
						products[i] = aux;
					}else if( (typeof(products[i]) == 'object') && (typeof(products[j]) =='object' ) ){
						if((products[i].validates > products[j].validates)){
							let aux = products[i];
							products[i] = products[j];
							products[j] = aux; 
						}
					}
				} // FIN DEL FOR INTERNO
			} // FIN DEL PRIMER IF
		} // FIN DEL PRIMER FOR

		//Alert.alert('DEBUG-2', JSON.stringify(products))

		let data = [];
		for(let i = 1; i < 7; i++){
			if( typeof(products[i])  == 'object' )
				data.push({x: i, y: 8, width: 6});
		}
		//Alert.alert('DEBUG', JSON.stringify(this.state.data));
		//
		/*this.setState({
			data: data,
			products
		});*/
	}

	render(){

		return(
			<View style={styles.container}>
				<StatusBar translucent={false} backgroundColor={'#02A6A4'} />
				<ScrollView>
				<Card >
					<CardItem>
						<Left>
							<H3>Ventas por Productos</H3>
						</Left>
					</CardItem>
					<CardItem style={{width: "100%"}}>
						<VictoryChart 
							theme={VictoryTheme.material} 
							domain={{ x: [1, 7], y: [0, 6] }}
						>
							<VictoryBar 
								categories={{y: this.renderCategories()}}
								alignment={"start"}
								data={this.state.data}
								animate={{ duration: 2000 }}
							/>
						</VictoryChart>
					</CardItem>
				</Card>
				<Card>
					<CardItem>
						<Left>
							<H3>Cantidad de Ventas</H3>
						</Left>
					</CardItem>
					<CardItem style={{width: "100%"}}>
						<VictoryChart 
							theme={VictoryTheme.material} 
							domain={{ x: [1, 7], y: [0, 6] }}
						>
							<VictoryBar 
								categories={{y: this.renderCategories()}}
								alignment={"start"}
								data={this.state.data}
								animate={{ duration: 2000 }}
							/>
						</VictoryChart>
					</CardItem>
				</Card>
				<Card>
					<CardItem>
						<Left>
							<H3>Ventas anuales</H3>
						</Left>
					</CardItem>
					<CardItem style={{width: "100%"}}>
						<VictoryChart 
							theme={VictoryTheme.material} 
							domain={{ x: [1, 7], y: [0, 6] }}
						>
							<VictoryBar 
								categories={{y: this.renderCategories()}}
								alignment={"start"}
								data={this.state.data}
								animate={{ duration: 2000 }}
							/>
						</VictoryChart>
					</CardItem>
				</Card>
				</ScrollView>
			</View>
		);
	}

}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	}
}