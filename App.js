import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Alert, AppState } from 'react-native';
import { checkFirstLaunch , getMenuList, getUserInfo, isUserRegistered, putUserInfo, getMenuDetail, postOrder, getOrderInfo, loadDataBackGround, deUserRegistered, saveDataBackGround, checkLastScreen } from './viewmodel/AppViewModel';
import { handlePositionPermission, getCoords, hasLocationPermission } from './viewmodel/LocationViewModel';
import { menuListInsertDB } from './viewmodel/DBViewModel';
import DBController from './model/DBController';
import Home from './components/Home';
import ProfileInfo from './components/ProfileInfo';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import ItemList from './components/ItemList';
import MenuDetail from './components/MenuDetail';
import { OrderStatus } from './components/OrderStatus';

export default function App() {

  /* ------------------------------ Configuration and State Variables ------------------------------ */

  // Screen logic
  const [currentScreen, setCurrentScreen] = useState("Home")
  
  const currentScreenRef = useRef(currentScreen) //refers to currentScreen

  // User sid, is saved for greater security
  const [sid , setSid] = useState(null) 

  // Menu identifier, used to manage background logic
  const [mid, setMid] = useState(null)

  const midRef = useRef(mid) //refers to mid

  // The coordinates are initialized to a value where the user cannot be, 
  // so that operations are only performed when a valid position is obtained

  // Set the user's latitude
  const [lat, setLat] = useState(-48.88120089)

  // Set the user's longitude
  const [lng , setLng] = useState(-123.34616041)

  // Check the status of saving menus in the DB
  const [checkMenuListDB , setCheckMenuListDB] = useState(false)

  // All list of menu
  const [menuList , setMenuList] = useState(null)

  // Save the selected menu
  const [menuDetail , setMenuDetail] = useState(null)

  // Save info about user's order
  const [myOrder, setMyOrder] = useState(null)

  // "Temporary storage" of my DB
  const [myDBController, setMyDBController] = useState(null)

  // User data once registered
  const [userData, setUserData] = useState(null)

  // Control logic whether the user is registered or not needs in ProfileInfo.jsx
  const [profileBool, setProfileBool] = useState(null)

  // Object for the registration form
  const [cardDetails, setCardDetails] = useState({
    firstName: '',
    lastName: '',
    cardFullName: '',
    cardNumber: '',
    cardExpireMonth: '',
    cardExpireYear: '',
    cardCVV: ''
  })
  // Function to update the field values ​​of the "CardDetails" object
  const handleCardDetailsChange = (name, value) => {
    setCardDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }))
  }

  /* --------------------------------------------- handleEvent --------------------------------------------- */

  /* --------------- Handle Profile event --------------- */

  // Function to unregister the user
  // set 'profileBool' to null to reflect the change immediately
  const handleDeRegisteredEvent = async () => {

    await deUserRegistered()
    setProfileBool(null)

  }

  // Check if the user is already registered
  // If it is (profileBool == true), get the user data from the server
  // If it is not, it will show the registration form , whose logic is implemented in the "ProfileInfo" component
  const handleProfileEvent = async () => {

    const value = await isUserRegistered()
    setProfileBool(value)

    
    if(value){
      try{
        const response = await getUserInfo()
        //console.log("Response:" , response)
        setUserData(response)
      } catch (error) {
        console.log("handleProfileEvent error: " , error)
        setCurrentScreen("Error")
      }
    }
    setCurrentScreen("Profile")
  }

  // Manage the user registration submission
  const handleProfileSubmit = async () => {

    //Check that the card has exactly 16 digits
    if(cardDetails.cardNumber.length != 16){

      //Inform the user of the error
      Alert.alert(
        "Credit card length doesn't match ",
        "Please, insert a valid credit card that has 16 digits",
        [{ text: "OK" }]
      )

    } else {
    //Make the network call
    //Set the screen to "Home"
    //Update the value to represent that the user is now registered
    try{

      await putUserInfo(cardDetails)
      setCurrentScreen("Home")
      

      //Shows the successful registration alert
      Alert.alert(
        "Success!!",
        "Registration successful!",
        [{ text: "OK" }]
      )

    } catch (error) {
      console.log("Errore:" , error)
      setCurrentScreen("Error")
    }
    }
  }

  /* --------------- Handle Menu event --------------- */

  // Ask the user for location permissions
  // Once I get permission to get the location, I calculate the user's latitude and longitude
  // if the user does not grant permissions he cannot view the menus
  // every time the user tries to access the menu area, he is asked for the location, if it has not been granted
  const handleMenuListEvent = async () => {
    
    let permission = await hasLocationPermission()

    //If permits have not been granted must request them
    if (!permission) {
      permission = await handlePositionPermission()
    }
    

    if (permission) {
        // Permission granted

        try {
          //Set the calculated coordinates
            const coords = await getCoords()
            
            setLat(coords.latitude)
            setLng(coords.longitude)

            // Wait for the state to update
            const updatedLat = coords.latitude
            const updatedLng = coords.longitude

            //console.log("Lat: " , updatedLat , "Lng:" , updatedLng)

            const result = await getMenuList(updatedLat, updatedLng)
            setMenuList(result)

        } catch (error) {
            console.log("handleMenuListEvent error: ", error)
            setCurrentScreen("Error")
        }
        setCurrentScreen("MenuList")
    } else {
        // Permission NOT granted
        //console.log("Permission not granted")

        // Inform the user
        Alert.alert(
            "Permission Required",
            "Please , accept location permissions for this app from settings to display menus near you",
            [{ text: "OK" }]
       
        )
    }
  }

  // Once the user clicks on "view info" a network call is made to show the details
  const handleMenuDetail = async (mid) => {

    setCurrentScreen("MenuDetail")
    //Save the menu identifier, so I can recover it if the app goes into the background
    setMid(mid)

    try{

      const result = await getMenuDetail(mid, lat, lng)
      setMenuDetail(result)

    } catch (error) {
      console.log("handleMenuDetail error: " , error)
      setCurrentScreen("Error")

    }
    
  }

  /* --------------- Handle Order event --------------- */

  // The logic of the screen is determined by the "myOrder" state, to view the order, must first place one
  // if the user has placed an order, he has already accepted the location's permissions
  // and also registered correctly
  // in any case other than these, "myOrder" is null
  // if the user placed an order, an oid was saved in the asyncStorage
  // just take the last one
  // otherwise, closing and reopening the app, "myOrder" returns to null 
  // and cannot recover the last order unless making another request
  // however need to check whether the location permissions are there because the user may have removed them
  const handleMyOrderEvent = async () => {

    let permission = await hasLocationPermission()

    //If permits have not been granted must request them
    if (!permission) {
      permission = await handlePositionPermission()
    }

    //If the permissions are there retrieve the latest order
    if(permission) {
      try {

        //Set the calculated coordinates
        //This is because if the user accepts the permissions from here, then he must save coords somehow
        const coords = await getCoords()
            
        setLat(coords.latitude)
        setLng(coords.longitude)

        const result = await getOrderInfo()
        setMyOrder(result)
      } catch (error) {
        console.log("handleMyOrderEvent error: " , error)
        setCurrentScreen("Error")
      }
      setCurrentScreen("MyOrder")
    } else {
      // Permission NOT granted
        //console.log("Permission not granted")

        // Inform the user
        Alert.alert(
          "Permission Required",
          "Please , accept location permissions for this app from settings to display menus near you",
          [{ text: "OK" }]
      )
    }
  }

  // Place a new order
  // checks whether the user is already registered, 
  // if he is he places the order, otherwise it sends him to the registration screen
  const submitNewOrder = async (mid) => {

    //Check if user is already registered
    const value = await isUserRegistered()

    if(value) {
      //user registered
      try {

        //make network call
        const result = await postOrder(mid, lat, lng)

        //If the card inserted is invalid, will notify the user
        if(result === 403) {

          Alert.alert(
            "Invalid credit card",
            "Please , enter a valid credit card",
            [{ text: "OK" }]
          )
          //stay on screen --> MenuDetail
          setCurrentScreen("MenuDetail")

        //If the user already has an active order
        } else if (result === 409) {

          Alert.alert(
            "You already have an active order",
            "Please , wait for your order to be delivered before placing another",
            [{ text: "OK" }]
          )
          //stay on screen --> MenuDetail
          setCurrentScreen("MenuDetail")


        } else {

          //If the card inserted is valid, update myOrder and go to screen --> MyOrder

          Alert.alert(
            "Order completed successfully!",
            "Find the necessary information on the 'My Order' screen",
            [{ text: "OK" }]
          )

          setMyOrder(result)
          setCurrentScreen("MyOrder")
        }

      } catch(error) {
        console.log("submitNewOrder error: " , error)
        setCurrentScreen("Error")
      }

      
    } else {
      // Inform the user that they must register first
      Alert.alert(
        "You are not registered",
        "Please , register to place a new order",
        [{ text: "OK" }]
      )
    setCurrentScreen("Profile")
    }
  }

  

  /* --------------------------------------------- State Event --------------------------------------------- */

  /* --------------- Inizializate DB --------------- */

  // When the App component is mounted
  useEffect(() => {

    // Opening the DB
    const startDB = async () => {
      const controller = new DBController()
      try{
        await controller.openDB()
        console.log("DB opened")
        setMyDBController(controller)
      }catch (error){
        console.log("Error on DB opening")
        setCurrentScreen("Error")
      }
    }
    startDB()
  } , [])

  /* --------------- Check first launch --------------- */

  // When the DB is initialized, check on the first boot
  // the logic is described in the AppViewModel
  // also checks if there is a saved screen in the AsyncStorage, if there is, recovers it
  useEffect(() => {

    //For greater security, check that the DB is not null
    if(myDBController) {
      const handleFirstLaunch = async() => {

        try{
          //console.log("check first launch...")
          let result = await checkFirstLaunch()
          setSid(result)
        } catch (error) {
          setCurrentScreen("Error")
        }
      }

      // check saved screen in the AsyncStorage
      const checkAppState = async() => {
        const bool = await checkLastScreen()

        if(bool) {

            await loadDataBackGround(
              () => setCurrentScreen("Home"),
              handleProfileEvent,
              handleMenuListEvent,
              handleMyOrderEvent,
              handleMenuDetail,
            )
        }
      }

      checkAppState()
      handleFirstLaunch()
    }



  } , [myDBController])

  /* --------------- menuList's value in DB --------------- */

  // Every time the user's position changes, it saves the menus closest to him in the DB
  // first check that the pre-initialized coordinates are not saved
  // this means that either the user has not yet given permissions or 
  // that the component has not yet loaded completely
  // make the network call
  // the values ​​in the DB are updated
  useEffect(() => {

    if (!myDBController ) return

    setCheckMenuListDB(false)

    const menuListInsertDBOnChange = async () => {


    if(lat != -48.88120089 && lng != -123.34616041){
      try {

        const response = await getMenuList(lat, lng)
        //console.log("Response:" , response)
        if(response) {
          await menuListInsertDB(response, myDBController)
          //Setting it to "true" implies that have already saved nearby menus in the DB
          //so can show the menus, getting the image with a correct imageVersion comparison
          //otherwise the menu wouldn't know who to compare with
          setCheckMenuListDB(true)
        }

      } catch (error) {

        //console.log("Errore: " , error)
        setCurrentScreen("Error")

      }
    }

    }

    menuListInsertDBOnChange()

  } , [lat, lng, myDBController])

  /* --------------- Background screen management logic --------------- */

  // Reference value to currentScreen , is updated to reflect the change
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen])

  // Reference value to mid, is updated to reflect the change
  useEffect(() => {
    midRef.current = mid
  }, [mid])
  
  // Every time the app goes into the background, the current screen is saved to AsyncStorage
  // when the app runs again, the value is taken from the AsyncStorage
  // the display logic of the current screen is implemented
  useEffect(() => {

    const handleAppStateChange = (nextAppState) => {

      //app goes into the background
      if (nextAppState === 'background') {
        const saveData = async () => {
          console.log("Saving screen:", currentScreenRef.current)
          await saveDataBackGround(currentScreenRef.current , midRef.current)
        }
  
        saveData()
        //console.log("App is now in background")
      }
      
      //app is awakened
      if (nextAppState === 'active') {
        console.log("Current screen:", currentScreenRef.current)
  
        const loadData = async () => {
          await loadDataBackGround(
            () => setCurrentScreen("Home"),
            handleProfileEvent,
            handleMenuListEvent,
            handleMyOrderEvent,
            handleMenuDetail,
            midRef.current
          )
        }
  
        //console.log("we're back!")
        loadData()
      }
    }
  
    const subscription = AppState.addEventListener('change', handleAppStateChange)
  
    return () => {
      subscription.remove()
    }
  }, [])


  /* --------------------------------------------- Testing --------------------------------------------- */
  
  
  /*useEffect(() => {

    console.log("currentscreen: " , currentScreen)

  } , [currentScreen]) */

  /*useEffect(() => {

    const menuListShowDB = async () => {
      await myDBController.menuListShowDB()
    }

    menuListShowDB()

  } , [checkMenuListDB])*/

  /*useEffect(() => {

    console.log("Lat: " , lat , "Lng: " , lng)

  } , [lat, lng])*/

  /*useEffect(() => {
    const updatePosition = async () => {
        try {
            console.log("calculating new position")
            const coords = await getCoords()
            setLat(coords.latitude)
            setLng(coords.longitude)
        } catch (error) {
            console.error("Error updating position:", error)
        }
    };

    // Update position immediately
    updatePosition()

    // Set interval to update position every 10 seconds
    const intervalId = setInterval(updatePosition, 10000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])*/

  /*useEffect(() => {

    console.log("newOrder: " , myOrder)

  } , [myOrder])*/

  /*useEffect(() => {

    if (!myDBController ) return

    const initializedLatLng = async () => {

      //Check if user have already given permissions
      const permission = await hasLocationPermission()

      if(permission) {
        //Set the calculated coordinates
        const coords = await getCoords()
            
        setLat(coords.latitude)
        setLng(coords.longitude)
      }

    }

    initializedLatLng()

  } , [myDBController])*/

  /* --------------------------------------------- ScreenView --------------------------------------------- */

  switch (currentScreen) {

    /* --------------- Home --------------- */ 

    case "Home":
      // Wait myDBController and sid not null
      return (
        <SafeAreaView style={styles.container}>
        {
        myDBController && sid ? 
          <Home 
            valueScreen={"Home"}
            handleScreen={() => setCurrentScreen("Home")} 
            handleScreenProfile={() => handleProfileEvent()}
            handleScreenMenuList={() => handleMenuListEvent()}
            handleScreenMyOrder={() => handleMyOrderEvent()}
          />
        : 
          <LoadingScreen />
        }
        </SafeAreaView>
      )

    /* --------------- Profile --------------- */ 
      
    case "Profile":
      return (
        <SafeAreaView style={styles.container}>
          
          <ProfileInfo 
            profileBool={profileBool}
            userData={userData}
            cardDetails={cardDetails}
            handleCardDetailsChange={handleCardDetailsChange}
            handleScreenMyOrder={() => handleMyOrderEvent()}
            handleSubmit={() => handleProfileSubmit()}
            handleScreen={() => setCurrentScreen("Home")} 
            handleHomeScreen={() => setCurrentScreen("Home")}
            handleDeRegisteredEvent={() => handleDeRegisteredEvent()}
          />
            
        </SafeAreaView>
      )

      /* --------------- menuList --------------- */ 

    case "MenuList":
        return (
          <SafeAreaView style={styles.container}>
          {
          menuList && checkMenuListDB?
            <ItemList
              menus={menuList}
              db = {myDBController}
              handleScreen={() => setCurrentScreen("Home")} 
              handleMenuDetail={handleMenuDetail}
              handleHomeScreen={() => setCurrentScreen("Home")}
            />
          :
            <LoadingScreen />
          }
          </SafeAreaView>
        )

      /* --------------- menuDetail --------------- */ 

    case "MenuDetail":
        return (
          <SafeAreaView style={styles.container}>
          {
          menuDetail ?
            <MenuDetail
              item={menuDetail}
              db = {myDBController}
              mid = {menuDetail.mid}
              handleScreen={handleMenuListEvent} 
              submitMyOrder={submitNewOrder}
              handleHomeScreen={() => setCurrentScreen("Home")}
            />
          :
            <LoadingScreen />
          }
          </SafeAreaView>
        )

        /* --------------- myOrder --------------- */ 

    case "MyOrder":
        return (
        <SafeAreaView style={styles.container}>

                {
                
                <OrderStatus
                orderInfo={myOrder}
                handleScreen={() => setCurrentScreen("Home")}
                handleHomeScreen={() => setCurrentScreen("Home")}
                refreshOrderInfo={() => handleMyOrderEvent()}
                
                />
                
                }
        </SafeAreaView>
    )
    default:
      return (
        <SafeAreaView style={styles.container}>
          <ErrorScreen
            handleScreen={() => setCurrentScreen("Home")} 
            handleHomeScreen={() => setCurrentScreen("Home")}
          />
        </SafeAreaView>
      )
  }
}

/* --------------- Style --------------- */ 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEFF1',
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  noOrderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
})