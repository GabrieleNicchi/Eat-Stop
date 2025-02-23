import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import Header from './Header'; 

/* --------------- Home  --------------- */ 

function Home({ handleScreen, handleScreenProfile, handleScreenMenuList , handleScreenMyOrder }) {
  
  // Return component
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        valueScreen={"Home"}
        handleScreen={handleScreen} 
      />
      
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      
      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>

        <TouchableOpacity style={styles.button} onPress={handleScreenProfile}>
          <Image source={require('../assets/profile.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleScreenMenuList}>
          <Image source={require('../assets/tacos.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleScreenMyOrder}>
          <Image source={require('../assets/pony_location.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>My Order</Text>
        </TouchableOpacity>
        {/*  
        <TouchableOpacity style={styles.button} onPress={handleScreen}>
          <Image source={require('../assets/jalapenos.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>...Soon...</Text>
        </TouchableOpacity>
        */}
      </View>
    </SafeAreaView>
  )
}

/* --------------- Style --------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#EEEFF1'
  },
  
  logoContainer: {
    marginTop: 40, 
    marginBottom : 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F96167',
    borderRadius: 30,
    padding: 20,
    marginHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    width: '40%',
    height: 120, 
    backgroundColor: '#F96167',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    borderRadius: 10,
  },
  buttonImage: {
    width: 80,
    height: 80,
  },
  buttonText: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Home