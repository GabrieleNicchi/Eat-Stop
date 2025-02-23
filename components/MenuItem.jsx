import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getMenuImage } from '../viewmodel/DBViewModel';

/* --------------- MenuItem  --------------- */ 

// Single list menu
const MenuItem = ({ menu, handleMenuDetail, db }) => {

  // Store the menu image
  const [imageUri, setImageUri] = useState(null)

  // UseEffect implements the logic of fetching images

  useEffect(() => {
    const fetchImage = async () => {
      
      // Prefix for base64 images
      let base64WithPrefix = "data:image/jpeg;base64,"
      
        try {
          
          // Find the image following the logic of the DBViewModel
          const uri = await getMenuImage(menu.mid, menu.imageVersion, db)
          //console.log(uri)
          if(uri) {
            setImageUri(base64WithPrefix + uri)
          }
          

        } catch (error) {
          console.error("Error loading image:", error)
        }
       
    }
  
    fetchImage()
  }, [menu]) // update every time menu changes/goes through
  

  //Return component
  return(
  <View style={styles.itemContainer}>
    {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text>Loading image...</Text>
      )}
    <Text style={styles.name}>{menu.name}</Text>
    <Text style={styles.description}>{menu.shortDescription}</Text>
    <Text style={styles.price}>Price: ${menu.price}</Text>
    <Text style={styles.deliveryTime}>
      Delivery Time: {menu.deliveryTime} mins
    </Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleMenuDetail}>
          <Text style={styles.buttonText}>VIEW DETAIL</Text>
      </TouchableOpacity>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    padding: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F96167',
    borderRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: '#F96167',
    marginBottom: 8,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#665',
  },
  price: {
    fontSize: 16,
    color: '#000',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#665',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop : 5
  },
  button: {
    flex: 1,
    height: 50,
    width: 350,
    borderRadius: 10,
    backgroundColor: '#F96167',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#EEEFF1',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default MenuItem