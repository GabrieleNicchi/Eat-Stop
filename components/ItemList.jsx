import React, { useState, useEffect } from 'react';
import {Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { getCoords } from '../viewmodel/LocationViewModel';
import MenuItem from './MenuItem';
import Header from './Header';

/* --------------- ItemList  --------------- */

//Iterate over each MenuItem component, this will return the entire list
function ItemList({ menus, handleMenuDetail, db , handleScreen, handleHomeScreen}) {

    //Simulate the user in motion
    /* 
      const [myPosition, setMyPosition] = useState(null)
  
      
      let intervalId;
  
      const onLoad = () => {
          //console.log("Component mounted")
          intervalId = setInterval(() => {
              refreshPosition() //Call to update the component
          }, 20000); //Every 5 seconds
      }
  
      const onUnload = () => {
          //console.log("Component disassembled")
          clearInterval(intervalId)
      }
  
      useEffect(() => {
          onLoad() //When component mounted
          return onUnload // Clear when component disassembled
      }, [])
      

  
      useEffect(() => {

          const fetchPosition = async () => {
              try {
                  const location = await getCoords()
                  setMyPosition(location)
              } catch (error) {
                  console.log("OrderStatus --> Error in position calculation", error)
              }
          }
  
          if (menus) {
              fetchPosition()
          }
      }, [menus]) 
      */

  // Return component
  return (
    <SafeAreaView style={styles.container}>
        <Header 
            valueScreen={"MenuList"}
            handleScreen={handleScreen} 
            handleHomeScreen={handleHomeScreen}
        />
      <Text style={styles.title}>All orders in zone:</Text>
      <FlatList
        data={menus}
        renderItem={({ item }) => (
          // Pass to the handleMenuDetail function the mid
          <MenuItem menu={item} handleMenuDetail={()=>handleMenuDetail(item.mid)} db={db} />
        )}
        keyExtractor={(item) => item.mid.toString()} />
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
})

export default ItemList