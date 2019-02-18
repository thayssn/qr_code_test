import React, {Component} from 'react';
import { Alert, Linking, Dimensions, StyleSheet, Text, LayoutAnimation, View, TextInput, StatusBar, TouchableOpacity, Button } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { createStackNavigator, createAppContainer } from "react-navigation";

class HomeScreen extends Component{
  static navigationOptions = {
    title: 'Home',
  };

  state = {
    lastScannedUrl: 'Nenhum código encontrado'
  };

  _handlePress = () => this.props.navigation.navigate('Camera');

  render(){
    const itemId = this.props.navigation.getParam('result', this.state.lastScannedUrl);
    return (
      <View>
        <Text>{itemId}</Text>
        <Button onPress={this._handlePress} title='Open Scanner'/>
      </View>
    );
  };
}

class CameraScreen extends Component {
  static navigationOptions = {
    title: 'Camera',
  };

  state = {
    hasCameraPermission: null,
    lastScannedUrl: 'Alo Alo'
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    this.props.navigation.navigate('Home', {result: result.data});
  };

  _handlePress = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content'></StatusBar>
        <View>
          {this.state.hasCameraPermission === null
            ? <Text>Requesting for camera permission</Text>
            : this.state.hasCameraPermission === false
              ? <Text style={styles.text}>Camera permission is not granted</Text>
              : <View style={styles.container}>
                  <BarCodeScanner
                  barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                  onBarCodeRead={this._handleBarCodeRead}
                  style={StyleSheet.absoluteFill}/>
                  <Button style={{position: 'absolute', zIndex: 5}} onPress={this._handlePress} title='Close Scanner'/>
                </View>
            }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff'
  }
});

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Camera: CameraScreen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#333',
      },
      headerTintColor: '#ff0',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  });

export default createAppContainer(AppNavigator);