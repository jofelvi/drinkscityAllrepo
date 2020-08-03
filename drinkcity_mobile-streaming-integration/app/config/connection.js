import {
	AsyncStorage,
	Alert
} from 'react-native';

export default class Connection{

	constructor(){
		this.data = {
			protocol: 'http:',
			secure_protocol: 'https:',
			host: 'drinkscitys.herokuapp.com/api/v1',
			port: 36572,
			onlyUrl: 'drinkscitys.herokuapp.com',
			onSession: false,
			token: null,
			google_api_key: 'AIzaSyDdzklbLf_ANmGOWEfDNtNVLFMqNy65yBA'
		}
		// this.data = {
		// 	protocol: 'http:',
		// 	secure_protocol: 'https:',
		// 	host: '10ca35ef.ngrok.io/api/v1',
		// 	port: 36572,
		// 	onlyUrl: '10ca35ef.ngrok.io',
		// 	onSession: false,
		// 	token: null,
		// 	google_api_key: 'AIzaSyDdzklbLf_ANmGOWEfDNtNVLFMqNy65yBA'
		// }

	}

	 async _getAuthorization(){
			
		try{
			let session = await AsyncStorage.getItem("@session");
			session = JSON.parse(session);
			
			this.data.onSession = true;
			this.data.token = session.token;
		}catch(err){
			console.log(err)
		}
	}

	getGoogleKey(){
		return this.data.google_api_key;
	}

	getOnlyUrl(){
		return this.data.onlyUrl;
	}

	getSessionToken(){
		return this.data.token;
	}

	getProtocol(secure = false){
		return secure ? this.data.secure_protocol : this.data.protocol;
	}

	getHost(){
		return this.data.host;
	}

	getPort(){
		return this.data.port;
	}

	setProtocol(secure = false){
		if(secure)
			this.data.secure_protocol = protocol;
		else
			this.data.protocol = protocol;

		return ( (secure) ? this.data.secure_protocol : this.data.protocol );
	}

	setHost(host){
		this.data.host = host;
		return host;
	}


	getUrlApi(destino = false, login = true){
		let url = this.getProtocol(false) + '//'+this.getHost()+'/'+((typeof destino != 'boolean') ? destino :'' );
		return url;
	}
}