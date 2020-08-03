import React, { Component } from 'react';
import AppIntro from 'react-native-app-intro';
import {
	Button,
	Text,
	Container,
	Grid,
	Content,
	Row,
	Col
} from 'native-base';

import {
	Alert,
	Dimensions,
	Image,
	StyleSheet,
	View,
	Animated
} from 'react-native';

import Swiper from 'react-native-swiper';
import BackHandler from 'BackHandler';

import FontAwesome, {Icons} from 'react-native-fontawesome';

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
	backgroundColor: 'transparent'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width,
    flex: 1
}
});
export default class SlideScreen extends Component{

	static navigationOptions = {
		header: null
	}

	constructor(props){
		super(props);
	    this.state = {
	      skipFadeOpacity: new Animated.Value(1),
	      doneFadeOpacity: new Animated.Value(0),
	      nextOpacity: new Animated.Value(1),
	      parallax: new Animated.Value(0),
	    };

	}

	componentWillMount(){
		BackHandler.addEventListener('hardwareBackPress',()=>{
			BackHandler.exitApp();
			return false;
		});
	}

	render(){
		const  windows = Dimensions.get('window');
		
		   	const resizeMode = 'cover';
		    
		   return(
		   	<View>
				<Swiper 
					style={styles.wrapper}
					style={styles.wrapper} 
					autoplay={true}
					showsPagination={false}
					height={windows.height}
			          onScroll={Animated.event(
			            [{ x: this.state.parallax }]
			          )}
				>
		          <View style={styles.slide} title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}>
		            <Image resizeMode='stretch' style={styles.image} source={require('../assets//img/5.jpg')} />
				  </View>
		          <View style={styles.slide} title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}>	            
		            <Image resizeMode='stretch' style={styles.image} source={require('../assets//img/4.jpg')} />	
				  </View>
		          <View style={styles.slide} title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}>	          
		            <Image resizeMode='stretch' style={styles.image} source={require('../assets//img/3.jpg')} />
				  </View>
		          <View style={styles.slide} title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}>	            
		            <Image resizeMode='stretch' style={styles.image} source={require('../assets//img/2.jpg')} />	
				  </View>
		          <View style={styles.slide} title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}>
		            <Image resizeMode='stretch' style={styles.image} source={require('../assets//img/1.jpg')} />
				  </View>
				</Swiper>
				  	<Button onPress={()=>{ this.props.navigation.navigate('RootScreen') }} block  style={{backgroundColor: "#01DAC9" ,  width: "95%",flex: 1, position: "absolute", bottom: 27, alignSelf: "center", alignContent: "center"}}>
				  		<Text>
				  			Ingresar {/*<FontAwesome>{Icons.arrowRight}</FontAwesome>*/}
				  		</Text>
				  	</Button>
				</View>
		   );
	}
}