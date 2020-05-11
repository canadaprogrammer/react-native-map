import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import MapView, {Marker} from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default class App extends React.Component {
  state = {
    location: null,
  }

  _getLocationAsync = async () => {
    // let {status} = await Permissions.askAsync(Permissions.LOCATION);
    // if (status !== 'granted') {
    //   console.error('Location is not granted!')
    //   return;
    // }
    let {status} = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      console.error('Permission to access location was denied')
      return
    }

    let location = await Location.getCurrentPositionAsync({})

    let therapy = (await Location.geocodeAsync('574 Carlton St'))[0]
    let timHortons = (await Location.geocodeAsync('579 Carlton St'))[0]
    let carletonPS = (await Location.geocodeAsync('1 Carlton Park Dr'))[0]
    let where = (await Location.reverseGeocodeAsync(location.coords))[0];
    this.setState({
      location, 
      places: {
        therapy, timHortons, carletonPS
      },
      where,
    })

  }

  componentDidMount() {
    this._getLocationAsync()
  }

  render() {
      if (!this.state.location) return (<View />);
      return (
      <MapView 
        style={{flex:1}}
        initialRegion={{
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude,
          latitudeDelta: 0.0922 / 5,
          longitudeDelta: 0.0421 / 5,
        }}
      >
        <Marker 
          coordinate={this.state.location.coords}
          title="You are here"
          description={this.state.where.name}
        />
        <Marker
          coordinate={this.state.places.therapy}
          title="Therapy"
          description="Cornerston Therapy and Wellness"
          pinColor="blue"
        />
        <Marker
          coordinate={this.state.places.timHortons}
          title="Tim Hortons"
          description="Coffee chain serving snacks and light fare"
          pinColor="yellow"
        />
        <Marker
          coordinate={this.state.places.carletonPS}
          title="Carleton Public School"
          pinColor="green"
        />
      </MapView>
    );
  }
}