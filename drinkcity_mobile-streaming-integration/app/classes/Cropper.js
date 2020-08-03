import ImagePicker from 'react-native-image-crop-picker';
import React from 'react'
import {
	Alert
} from 'react-native'

export default class Cropper extends React.Component {

	async cropping(path, width = 200, height = 200){
		let imgn = {};
		imgn = await ImagePicker.openCropper({
			path: 'file://'+path,
			width,
			height,
			cropping: true,
			cropperToolbarTitle:'Editar imagen',

			includeBase64: true
		});
		return imgn;
	}
}