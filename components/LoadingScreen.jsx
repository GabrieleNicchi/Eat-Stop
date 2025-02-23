import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

/* --------------- LoadingScreen  --------------- */ 

// Return component
function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/loading.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  )
}

/* --------------- Style --------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export default LoadingScreen