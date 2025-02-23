/* ------------------------------ ONLY TESTING ------------------------------ */

/*


// Test
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { getImageMenu } from '../viewmodel/DBViewModel';
import Header from './Header';
import { getMenuDetail } from '../viewmodel/AppViewModel';
import MenuItem from './MenuItem'; 

function Test({ favorites, lat, lng, handleMenuDetail, db, handleScreen, handleHomeScreen, lastScreen }) {
    const [menus, setMenus] = useState([])
  
    useEffect(() => {
  
      lastScreen()
  
    } , [])
  
    useEffect(() => {
      const handleGetFavorite = async () => {
        const fetchedMenus = []
        for (const i of favorites) {
          try {
            const menu = await getMenuDetail(i, lat, lng)
            fetchedMenus.push(menu)
          } catch (error) {
            console.log("Error fetching menu detail in Test:", error)
          }
        }
        setMenus(fetchedMenus)
      }
      handleGetFavorite()
    }, [favorites, lat, lng])
  
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          valueScreen={"Test"}
          handleScreen={handleScreen} 
          handleHomeScreen={handleHomeScreen}
        />
        {menus.length > 0 ? (
          <>
            <Text style={styles.title}>Favorites:</Text>
            <FlatList
              data={menus}
              renderItem={({ item }) => (
                <MenuItem menu={item} handleMenuDetail={() => handleMenuDetail(item.mid)} db={db} />
              )}
              keyExtractor={(item) => item.mid.toString()}
            />
          </>
        ) : (
          <Text>No favorites</Text>
        )}
      </SafeAreaView>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EEEFF1'
    },
    title: {
      fontSize: 24,
      padding: 10,
      fontWeight: 'bold',
      color: '#F96167',
      textAlign: 'center',
    },
  });
  
  export default Test

// MenuDetail
const MenuDetail = ({ item, mid, db, submitMyOrder, handleScreen, handleHomeScreen, addToFavorites, removeFromFavorites }) => {
  
  const [imageUri, setImageUri] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchImage = async () => {
      let base64WithPrefix = "data:image/jpeg;base64,";
      try {
        const uri = await getImageMenu(mid, db);
        if (uri) {
          setImageUri(base64WithPrefix + uri);
        }
      } catch (error) {
        console.log("Errore in MenuDetail -> fetchImage", error);
      }
    }
    fetchImage()
  }, [item])

  useEffect(() => {
    const handleCheckFavorites = async () => {
      const bool = await checkFavorites(mid)
      setIsFavorite(bool)
    }
    handleCheckFavorites()
  }, [mid])

  const handleAddToFavorites = async () => {
    await addToFavorites(mid)
    setIsFavorite(true)
  }

  const handleRemoveFromFavorites = async () => {
    await removeFromFavorites(mid)
    setIsFavorite(false)
  }

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
            {isFavorite ? (
              <TouchableOpacity style={styles.button} onPress={handleRemoveFromFavorites}>
                <Text style={styles.buttonText}>REMOVE FROM FAVORITE</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleAddToFavorites}>
                <Text style={styles.buttonText}>ADD TO FAVORITE</Text>
              </TouchableOpacity>
            )}
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
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    width: '100%', 
    margin: 2,
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

//AppViewModel.js
export const handleAddToFavorite = async (mid) => {

    try {
      // Recupera l'array 'favorites' dall'AsyncStorage
      const favorites = await AsyncStorage.getItem('favorites')
      
      let favoritesArray = []
      
      if (favorites !== null) {
        // Se esiste, parsalo in un array
        favoritesArray = JSON.parse(favorites)
      }
      
      // Aggiungi il 'mid' all'array se non è già presente
      if (!favoritesArray.includes(mid)) {
        favoritesArray.push(mid)
      }
      
      // Salva nuovamente l'array nell'AsyncStorage
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray))

      return favoritesArray
      
      console.log('Item added to favorites:', mid)
    } catch (error) {
      console.log('Errore in handleAddToFavorite:', error)
    }



  }

  export const handleRemoveFromFavorites = async (mid) => {

    try {
      // Recupera l'array 'favorites' dall'AsyncStorage
      const favorites = await AsyncStorage.getItem('favorites')
      
      let favoritesArray = []
      
      if (favorites !== null) {
        // Se esiste, parsalo in un array
        favoritesArray = JSON.parse(favorites)
      }
      
      // Rimuovi il 'mid' all'array se è già presente
      if (favoritesArray.includes(mid)) {
        favoritesArray = favoritesArray.filter((f) => f !== mid)
      }
        
      
      // Salva nuovamente l'array nell'AsyncStorage
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray))

      return favoritesArray
      
      console.log('Item removed from favorites:', mid)
    } catch (error) {
      console.log('Errore in handleRemoveFromFavorites:', error)
    }


  }

  export const getFavoritesFromAsyncStorage = async () => {

    try {
      // Recupera l'array 'favorites' dall'AsyncStorage
      const favorites = await AsyncStorage.getItem('favorites')
      
      let favoritesArray = []
      
      if (favorites !== null) {
        // Se esiste, parsalo in un array
        favoritesArray = JSON.parse(favorites)
      }

      console.log("favoritesArray: " , favoritesArray)
      return favoritesArray

    } catch (error) {
      console.log("getFavoritesFromAsyncStorage: something went wrong")
    }

  }

  export const checkFavorites = async (mid) => {
    console.log("checkFavorites called")
    try {
      const favorites = await AsyncStorage.getItem('favorites')
      console.log("checkFavorites mid:", mid)
      let favoritesArray = []
      
      if (favorites !== null) {
        favoritesArray = JSON.parse(favorites)
      }
      
      if (favoritesArray.includes(mid)) {
        //console.log("it's true")
        return true;
      }
      //console.log("it's false")
      return false;
    } catch (error) {
      console.log('Errore in checkFavorites:', error)
      return false
    }
  }

  //App.js

  const [favorites, setFavorites] = useState(null)

  const addToFavorites = async (mid) => {

    console.log("addToFavorite called")

    const fav = await handleAddToFavorite(mid)
    setFavorites(fav)
    

  }

  const removeFromFavorites = async (mid) => {

    console.log("removeFromFavorites called")

    const fav = await handleRemoveFromFavorites(mid)
    setFavorites(fav)
    
  }











*/