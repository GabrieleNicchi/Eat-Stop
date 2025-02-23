import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Header from './Header'; 

/* --------------- ErrorScreen  --------------- */ 

function ErrorScreen({ handleScreen, handleHomeScreen }) {

  // Return component
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        valueScreen={"Error"}
        handleScreen={handleScreen} 
        handleHomeScreen={handleHomeScreen}
      />
      
      {/* Error Message Section */}
      <View style={styles.messageContainer}>
        <Text style={styles.errorMessage}>Something gone wrong</Text>
      </View>
      
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={require('../assets/error.jpg')} style={styles.image} />
      </View>
      
      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleScreen}>
          <Text style={styles.buttonText}>Back to the homepage</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

/* --------------- Style --------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEFF1',
  },
  messageContainer: {
    marginTop: 20, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  errorMessage: {
    fontSize: 24,
    color: '#F96167',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  image: {
    width: 350,
    height: 300,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#F96167',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default ErrorScreen