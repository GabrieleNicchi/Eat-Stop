import React, { useEffect, useState } from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getImageMenu } from '../viewmodel/DBViewModel';
import Header from './Header';

/* --------------- MenuDetail  --------------- */ 

const MenuDetail = ({ item, mid, db, submitMyOrder, handleScreen, handleHomeScreen }) => {

  // Store the menu image
  const [imageUri, setImageUri] = useState(null)

  // UseEffect implements the logic of fetching images

  useEffect(() => {
    const fetchImage = async () => {

      // Prefix for base64 images
      let base64WithPrefix = "data:image/jpeg;base64,"

      
      try {

          // The image version logic has already been done in the menu list
          // then the image will be correctly updated in the DB
          const uri = await getImageMenu(mid, db)

          if (uri) {
            setImageUri(base64WithPrefix + uri)
          }

      } catch (error) {
          console.log("Errore in MenuDetail -> fetchImage", error)
      }
      
    }
    fetchImage()
  }, [item]) // update every time item changes/goes through


  // Return component
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        valueScreen={"MenuDetail"}
        handleScreen={handleScreen} 
        handleHomeScreen={handleHomeScreen}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.itemContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text>Loading image...</Text>
          )}
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.shortDescription}</Text>
          <Text style={styles.price}>Price: ${item.price}</Text>
          <Text style={styles.deliveryTime}>
            Delivery Time: {item.deliveryTime} mins
          </Text>
          <Text style={styles.description}>{item.longDescription}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => submitMyOrder(item.mid)}>
              <Text style={styles.buttonText}>ORDER NOW!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEFF1',
  },
  scrollContainer: {
    alignItems: 'center', 
    paddingVertical: 20, 
  },
  itemContainer: {
    width: '90%', 
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 16,
  },
  image: {
    width: '100%', 
    height: 350, 
    borderWidth: 3,
    borderColor: '#F96167',
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    resizeMode: 'cover', 
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  button: {
    width: '100%', 
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F96167',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#EEEFF1',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default MenuDetail