import React from 'react';

import {
	View,
	Text,
	Image,
	Button
} from 'react-native';

export default class BackgroundButton extends React.Component {

	constructor(props){
		super(props);
	}

	_renderIcon(){
		if(this.props.icon){
			return <Image
						source={this.props.icon}
						style={{
							width: 60,
							marginRight: 20,
							maxHeight: 100
						}}
					/> 
		}
	}

	render(){
		const resizeMode = 'cover';
		return(
			<View 
				style={{
					flex: 1,
					backgroundColor: 'transparent',
					width:  (!this.props.icon)? 162: 190,
					height: (!this.props.icon)? 35 : 63,
					borderRadius: 15
				}}
			>
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: "100%",
						height: '100%'
					}}
				>
					<Image 
						style={{
							flex: 1,
							resizeMode,
							width: "100%",
							borderRadius: (!this.props.icon)? 2: 7
						}}
						source={require('../assets/img/banda.png')}
					/>
				</View>
				<View
					style={{
						flex: 1,
						backgroundColor: 'transparent',
						justifyContent: 'center'
					}}
				>
					<Text 
						style={{
							textAlign: 'center',
							fontSize: this.props.font_size,
							color: "#ffffff"
						}}
					>
						{this.props.text}
					</Text>
				</View>
			</View>
		);
	}
}