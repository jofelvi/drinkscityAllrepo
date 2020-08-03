import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  View,
  Alert,
  StatusBar,
  Linking
} from 'react-native';

import {
  Header,
  Left,
  Text,
  Button,
  Icon,
  Body,
  Title,
  Grid,
  Row,
  Col
} from 'native-base';

// import Camera from 'react-native-camera';
// import { QRScannerView } from '../components/AC-QRCode-RN/lib/index';

import BackHandler from 'BackHandler';

import Camera from 'react-native-camera';

export default class QRScaner extends Component {
	static navigationOptions = ({navigation}) => ({
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" },
		title: 'VALIDAR CODIGO QR'
	});

  constructor(props){
    super(props);
    this.state = {
      onBarCodeRead: null,
      readed: false
    }
  }

  componentWillMount(){
    BackHandler.removeEventListener('hardwareBackPress', ()=> true);
    BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
    this.setState({
      camera : {
        onBarCodeRead: this.onBarCodeRead
      }
    })
  }

   _takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={false} backgroundColor={'#02A6A4'} />
        {/*<QRScannerView  
                  onScanResultReceived={this._onBarCodeRead.bind(this)}
                  renderTopBarView={this._topBarView.bind(this)}
                  renderBottomMenuView={this._topBarView.bind(this)}
                  hintText={'Posiciona el QR en el area delimitada'}
                />*/}
        <Camera
          ref={(ref) => {
            this.camera = ref;
          }}
          onBarCodeRead={(e) => this._onBarCodeRead(e)}
          style={styles.preview}>
          {
            this.state.readed &&
            <Grid>
              <Row style={{alignItems: "flex-end", alignSelf: "center", alignContent: "center"}}>
                <Col style={{width: "84%"}}>
                  <Button onPress={()=>{ this.setState({readed: false}); this.props.navigation.navigate('onScanner', {scanData: this.state.onBarCodeRead})}} block  style={{ backgroundColor: "#02A6A4"}}>
                    <Text style={{color: "#ffffff"}}>
                      VERIFICAR
                    </Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          }
          <Text style={styles.capture} onPress={() => this._takePicture()}>{this.state.onBarCodeRead}</Text>
      </Camera>
      </View>
    );
  }

  _topBarView = (e) =>{
    return null;
  }

  _bottomScanner = (e) =>{
    return null;
  }
 
  _onBarCodeRead=(e)=>{ 
    // alert(JSON.stringify(e))
    this.setState({
      onBarCodeRead: e.data,
      readed: true
    });
     // 

     // setTimeout(()=>{
     //  this.setState({
     //    onBarCodeRead: this._onBarCodeRead
     //  });
     // },4000)

  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  
});