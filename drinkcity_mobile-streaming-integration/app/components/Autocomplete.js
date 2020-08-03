import React from 'react';
import { View, Image, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};


const location = ()=>{
    var latitude = '';
    var longitude = '';
    navigator.geolocation.getCurrentPosition(
        (position) => {
            longitude = position.coords.longitude;
             latitude = position.coords.latitude;
            Alert.alert('DEBUG-AUTOCOMPLETE', longitude+' -> '+latitude)
            //Alert.alert("coords", "longitud: "+position.coords.longitude+' Longitud State: '+this.state.currentRegion.longitudeDelta+' latitude: '+position.coords.latitude+' accuracy: '+position.coords.accuracy)
        },
        (error) => alert(error.message),
        {enableHighAccuracy: false, timeout: 40000, maximumAge: 20000}
    );

    return `${latitude},${longitude}`;
}


const GooglePlacesInput = ( props ) => {


  return (
    <GooglePlacesAutocomplete
      placeholder='Buscar direccion'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed={true}    // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        props.onDirectionSelect(data, details);
      }}
      
      getDefaultValue={() => ''}
      
      poweredContainer={false}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyDdzklbLf_ANmGOWEfDNtNVLFMqNy65yBA',
        language: 'es', // language of the results
        types: 'address', // default: 'geocode'
        'location': props.latitude+','+props.longitude
      }}
      
      styles={{
        textInputContainer: {
          backgroundColor: '#111111',
          borderTopWidth: 0,
          borderBottomWidth:0,
          width: '100%'
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#ffffff'
        },
        listView:{
        	color :"#111111",
          backgroundColor: '#111111'
        },
        textInput: {
          marginLeft: 0,
          marginRight: 0,
          height: 38,
          backgroundColor: '#111111',
          color: 'white',
          fontSize: 16
        },
      }}

      isRowScrollable={true}
      enablePoweredByContainer={false}

      //currentLocationLabel={'Mi localizacion'}
      //currentLocation={true}
      
     // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      nearbyPlacesAPI='textsearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
      }}

      filterReverseGeocodingByTypes={[]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      renderLeftButton={()  => null}
      renderRightButton={() => null}
    />
  );
}

export default GooglePlacesInput;