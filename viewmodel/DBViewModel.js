import AsyncStorage from "@react-native-async-storage/async-storage"
import CommunicationController from '../model/CommunicationController'

/* ------------------------------------ DB function logic ------------------------------------ */

//Function to insert the useful data of each menu into the DB
export const menuListInsertDB = async (data , db) => {

    //Get the sid from the async storage
    const sid = await AsyncStorage.getItem('sid')
    
    //Iterate over the menu list
    for (const item of data) {
      try {
        //For each menu, extrapolate its image
        let response = await CommunicationController.getMenuImage(item.mid, sid)
        let img64 = response.base64

        //console.log("Mid: " , item.mid)
        //console.log("Version: " , item.imageVersion)
  
        //Enter the information into the DB
        await db.menuListInsertDB(item.mid, item.imageVersion, img64)
  
        //console.log(`Save in DB: MID ${item.mid}`)

      } catch (error) {
        console.log(`menuListInsertDB -> error processing MID: ${item.mid}:`, error)
      }
    } 
  }

  //Logic for obtaining the menu image
  //For each menu, pass the mid and the imageVersion
  //For each menu take the version saved in the DB and compare it with the past one
  export const getMenuImage = async (mid, version, db) => {

    //Get the sid from the async storage
    const sid = await AsyncStorage.getItem('sid')

    let img64 = ""
    let result = await db.getVersionMenu(mid)
    let DBversion = parseInt(result.Version, 10)
    //console.log("DBVersion:" , DBversion , "Version:" , version)

    //If they match, get the image from the DB
    if(version === DBversion) {

      //console.log("Version corresponds")
      const resultImg = await db.getImageMenu(mid)
      img64 += resultImg.Img64
      //console.log("img64:" , img64)
      
    //Otherwise, I take the image through a network call
    //Update the DB to reflect the new version of the image
    } else {

      console.log("Version not corresponds")
      let response = await CommunicationController.getMenuImage(mid, sid);
      img64 += response.base64
      //console.log(img64)

      await db.updateVersionImage(mid, version, img64)
      

    }
    return img64

  }
  //Function to return the menu image directly from DB
  export const getImageMenu = async (mid , db) => {

    try {
      const resultImg = await db.getImageMenu(mid)
      const img64 = resultImg.Img64
      return img64
    } catch (error) {
      console.log("getImageMenu -> DBViewModel error, " , error)
    }
    
  } 
