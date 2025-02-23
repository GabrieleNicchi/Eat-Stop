import CommunicationController from '../model/CommunicationController'
import AsyncStorage from "@react-native-async-storage/async-storage"

 /* ------------------------------------ Check function logic ------------------------------------ */

  // First boot logic, if the user logs in for the first time, a new sid associated with a uid is generated
  export const checkFirstLaunch = async () => {

    //Check if a sid is already registered

    const sid = await AsyncStorage.getItem('sid')
    const uid = await AsyncStorage.getItem('uid')
    
    //If it is not registered (first boot), register it

    if(sid === null) {

      //Retrieve information from the server

      const response = await CommunicationController.postSid()
      let newUid = response.uid.toString() // Convert to string
      let newSid = response.sid

      console.log("Sid: " , newSid , "Uid: " , newUid)

      //If I don't have null values, save to DB
      if(newSid && newUid) {
        await AsyncStorage.setItem('sid' , newSid)
        await AsyncStorage.setItem('uid' , newUid)
        //console.log("First launch completed!")
      }

      return newSid
    
    //If the user is already registered, simply return the sid
    } else {

      //console.log("User already registered, sid : " , sid , " uid: " , uid)
      return sid

    }

  }

  // Function to check if the user is already registered
  // NB when the user registers, the asyncStorage sets a value equal to "true"
  export const isUserRegistered = async () => {

    return await AsyncStorage.getItem('userData')

  }

  // Function to update 'userData' === null in the AsyncStorage
  // so the user does not appear registered
  export const deUserRegistered = async () => {

    try { 
      await AsyncStorage.setItem('userData', '')
    } catch (error) { 
      console.log('deUserRegistered error:', error);
    }

  }

  /* ------------------------------------ Background function logic ------------------------------------ */

  // Screen management logic when app is awakened
  // invoke the get data function based on the saved screen
  // if a value with key 'mid' has been saved recovers it
  export const loadDataBackGround = async (setHome, hpEvent, hmEvent, hoEvent, hdEvent) => {

    // recover screen
    const screen = await AsyncStorage.getItem('lastScreen')
    //console.log("loadDataBackGround -> currentScreen: " , screen)

    // recover mid
    const midAsync = await AsyncStorage.getItem('mid')
    const mid = parseInt(midAsync, 10)

    switch (screen) {
      
      case "Profile" :
        await hpEvent()
        break
      case "MenuList" :
        await hmEvent()
        break
      case "MenuDetail" :
        await hdEvent(mid)
        break
      case "MyOrder" :
        await hoEvent()
        break
      default :
        setHome()
    }

  }

  // Screen management logic when app goes to background
  // save the currentScreen into AsyncStorage
  // if the saved screen is "MenuDetail" , also save the corresponding mid to the AsyncStorage
  export const saveDataBackGround = async (screen , mid) => {

    try {
      //console.log("saveDataBackGround -> saving currentScreen: ", screen)
      await AsyncStorage.setItem('lastScreen', screen)
      if(screen === "MenuDetail"){
        //console.log("Mid saveData: "  , mid)
        await AsyncStorage.setItem('mid' , mid.toString())
      }
      
    } catch (error) {
      console.error("AppViewModel -> Error saving screen state:", error)
    }

  }

  // Function that checks if any screen has been saved in the AsyncStorage when the app starts
  // if something has been saved it returns "true",
  // "false" otherwise
  export const checkLastScreen = async () => {

    const screen = await AsyncStorage.getItem('lastScreen')

    if(screen) {
      console.log("Recover screen:" , screen)
      return true
    }
      console.log("No screen recover")
      return false
  }

  /* ------------------------------------ Network call logic ------------------------------------ */

  /* ---------------- GET  ---------------- */

  // Function to get user data
  export const getUserInfo = async () => {

    //Get the uid & sid from the async storage
    let uidString = await AsyncStorage.getItem('uid');
    const uid = parseInt(uidString, 10)
    const sid = await AsyncStorage.getItem('sid')

    try{
      
      //Make the network call
      return await CommunicationController.getUserInfo(uid , sid)

    } catch (error) {
      console.log("getUserInfo -> AppViewModel error: " , error)
    }

  }

  // Function to get menuList close to user
  export const getMenuList = async (lat, lng) => {

    //Get the sid from the async storage
    const sid = await AsyncStorage.getItem('sid')

    try {

      //Make the network call
      return await CommunicationController.getMenuList(lat, lng, sid)

    } catch (error) {
      console.log("getMenuList -> AppViewModel error: " , error)
    }


  }

  // Function to get detail of a menu
  export const getMenuDetail = async (mid , lat, lng) => {

    //Get the sid from the async storage
    const sid = await AsyncStorage.getItem('sid')

    try {

      //Make the network call
      return await CommunicationController.getMenuDetail(mid, lat, lng, sid)

    } catch (error) {
      console.log("getMenuDetail -> AppViewModel error: " , error)
    }

  }
  
  // Retrieve the last order made, if the user has made one, the oid is saved in the asyncStorage
  export const getOrderInfo = async () => {

    //Get the oid & sid from the async storage
    let oidString = await AsyncStorage.getItem('oid');
    
    //If no order has been placed, returns null
    if(oidString === null) {
      return null
    }

    const oid = parseInt(oidString, 10)
    const sid = await AsyncStorage.getItem('sid')

    try {

      //Make the network call
      return await CommunicationController.getOrderInfo(oid, sid)

    } catch (error) {
      console.log("getOrderInfo -> AppViewModel error: " , error)
    }


  }

  /* ---------------- PUT  ---------------- */
  
  // Function to register the user
  export const putUserInfo = async (cardDetails) => {

    //Get the uid & sid from the async storage
    let uidString = await AsyncStorage.getItem('uid');
    const uid = parseInt(uidString, 10)
    const sid = await AsyncStorage.getItem('sid')
    //Update the data to ensure that it reflects the data to be shown
    const updatedCardDetails = {
      ...cardDetails,
      cardExpireMonth: parseInt(cardDetails.cardExpireMonth, 10),
      cardExpireYear: parseInt(cardDetails.cardExpireYear, 10),
      sid: sid
    }

    try {

      //Make the network call
      await CommunicationController.putUserInfo(uid, updatedCardDetails)

      //If everything went well , must keep in mind that the user has already registered 
      //so as not to have to ask him every time
      
      await AsyncStorage.setItem('userData' , "true")
      

    } catch (error) {
      console.log("putUserInfo -> AppViewModel errore: " , error)
    }

  }

  /* ---------------- Post  ---------------- */

  // Logic for placing a new order
  export const postOrder = async (mid , lat, lng) => {

    //Get the sid from the async storage
    const sid = await AsyncStorage.getItem('sid')

    //console.log("Lat: "  , lat , "Lng: " , lng)

    //Creates an object in the format required for the network request
    const body = {
      sid: sid,
      deliveryLocation: {
        lat: lat,
        lng: lng
      }
    }

    try {
      //Make the network call
      const result = await CommunicationController.postOrder(mid, body)
      //console.log(result)

      //If the network request returns a 403 it means that the card inserted is invalid
      if(result === 403) {
        
        return 403
      }

      //If the network request returns a 409 it means that the user has already placed an order
      if(result === 409) {

        return 409
        
      }

      //Every time I place a new order, save its identifier in the AsyncStorage
      const newOid = result.oid.toString()
      await AsyncStorage.setItem('oid' , newOid)

      return result

    } catch (error) {
      console.log("postOrder -> AppViewModel error, " , error)
    }

  }