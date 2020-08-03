'use strict';
import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Camera from 'react-native-camera';
import Connection from '../config/connection'

export default class BadInstagramCloneApp extends Component {


  state = {
    recording: false,
    processing: false
  }

  _requestPermissions = async () => {
    if (Platform.OS === 'android') { 
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      return result === PermissionsAndroid.RESULTS.GRANTED || result === true
    }
    return true
  }

  _takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri)
    }
  }
  
  _onBarCodeRead = (e) => {
    console.log(`Barcode Found! Type: ${e.type}\nData: ${e.data}`)
  }

  componentDidMount = () => {
    ({ _, status }) => {
      if (status !== 'PERMISSION_GRANTED') {
        this._requestPermissions()
      }
    }
  }


  async startRecording() {
      let con = new Connection();
      
      this.setState({ recording: true });
      // default to mp4 for android as codec is not set
      const { path } = await this.camera.capture();
      this.setState({ recording: false, processing: true });
      const type = `video/mp4`;

      const data = new FormData();
      data.append("video", {
        name: "mobile-video-upload",
        type: type,
        uri: path
      });

      try {
        await fetch(con.getUrlApi('upload_video'), {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          },
          body: data
        });
      } catch (e) {
        console.log(e);
      }

      this.setState({ processing: false });
  }

  stopRecording() {
      // this.setState({ recording: false });
      this.camera.stopCapture();
  }

  render() {

    const { recording, processing } = this.state;

    let button = (
      <TouchableOpacity
        onPress={this.startRecording.bind(this)}
        style={styles.capture}
      >
        <Text style={{ fontSize: 14 }}> RECORD </Text>
      </TouchableOpacity>
    );

    if (recording) {
      button = (
        <TouchableOpacity
          onPress={this.stopRecording.bind(this)}
          style={styles.capture}
        >
          <Text style={{ fontSize: 14 }}> STOP </Text>
        </TouchableOpacity>
      );
    }

    if (processing) {
      button = (
        <View style={styles.capture}>
          <ActivityIndicator animating size={18} />
        </View>
      );
    }


    return (
      <View style={styles.container}>
        <Camera
          ref={(ref) => {
            this.camera = ref;
          }}
          // onBarCodeRead={(e) => this._onBarCodeRead(e)}
          aspect={Camera.constants.Aspect.fill}
          captureAudio={true}
          captureTarget={Camera.constants.CaptureTarget.cameraRoll}
          captureMode={Camera.constants.CaptureMode.video}
          playSoundOnCapture={true}
          style={styles.preview}>
          {/*<Text style={styles.capture} onPress={() => this._takePicture()}>[CAPTURE]</Text>*/}
        </Camera>
        <View
          style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}
        >
          {button}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
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
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});