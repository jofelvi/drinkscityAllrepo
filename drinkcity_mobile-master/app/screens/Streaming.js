import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ListView,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';

import {
  Grid,
  Row,
  Col
} from 'native-base';

import BackgroundButton from '../components/BackgroundButton';

import PropTypes from 'prop-types';

// import {
//   RTCPeerConnection,
//   RTCMediaStream,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   RTCVideoView,
//   MediaStreamTrack,
//   getUserMedia,
// } from 'react-native-webrtc';

// import Janus from '../components/WebRTC/janus.mobile.js';
// import config from '../config/janus.js';


// let server = config.JanusWssHost

// let janus;
// let sfutest = null;
// let started = false;

// let myusername = Math.floor(Math.random() * 1000);
// let roomId = 1234
// let myid = null;
// let mystream = null;

// let feeds = [];
// var bitrateTimer = [];

// Janus.init({debug: "all", callback: function() {
//         if(started)
//             return;
//         started = true;
// }});


export default class Video extends Component {

  static navigationOptions = ({navigation}) => ({
    title: `STREAMING`,
    headerTintColor: "#ffffff",
    headerStyle: { backgroundColor: "#01DAC9" }
  })

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
    this.state ={ 
      info: 'Initializing',
      status: 'init',
      roomID: '',
      isFront: true,
      selfViewSrc: null,
      selfViewSrcKey: null,
      remoteList: {},
      remoteListPluginHandle: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
      publish: false,
      speaker: false,
      audioMute: false,
      videoMute: false,
      visible: false
    };
  }

  render() {
    return (
      <Grid style={{backgroundColor: '#111111'}}>
        <Row>
          <Col>
          <TouchableOpacity onPress={()=>{ this.props.navigation.navigate('Transmit') }} style={{alignSelf: "center", alignItems: "center", alignContent: "center", marginTop: "10%", marginBottom: "10%"}}>
            <BackgroundButton 
              imagen={require('../assets/img/banda.png')} 
              text={'TRANSMITIR'}
              font_size={17}
              // btnSize={84}
              // icon={require('../assets/img/qrmini.png')}
            />
          </TouchableOpacity>
          </Col>
        </Row>
        <Row>
          <Col>
          <TouchableOpacity onPress={()=>{ this.props.navigation.navigate('Receive') }} style={{alignSelf: "center", alignItems: "center", alignContent: "center", marginTop: "10%", marginBottom: "10%"}}>
            <BackgroundButton 
              imagen={require('../assets/img/banda.png')} 
              text={'VER TRANSMISIONES'}
              font_size={17}
              // btnSize={84}
              // icon={require('../assets/img/qrmini.png')}
            />
          </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    );
  }
};

const styles = StyleSheet.create({
  selfView: {
    width: 200,
    height: 150,
  },
  remoteView: {
    backgroundColor: 'blue',
    transform: [{scale: 1.41}],
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/2.35
  },
  localView: {
    backgroundColor: 'yellow',
    transform: [{scale: 1.41}],
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
  },
});


