import * as SQLite from 'expo-sqlite';

export default class DBController{

    constructor(){

        // Initialize the database, initially empty
        this.db = null
    }

    // Database open function
    openDB = async () => {

        try{

            // Open DB
            this.db = await SQLite.openDatabaseAsync('MyDB')

            // When opening the database I immediately create the table on the menu list
            // so as not to have to do it later

            const query = 'CREATE TABLE IF NOT EXISTS menuList (MID INTEGER PRIMARY KEY, Version INTEGER, Img64 TEXT);'
            await this.db.execAsync(query)

            //console.log("openDB -> DB connected and table created")
        } catch (error){
            console.log("openDB -> Error occour during DB connection" , error)
        }

    }

    // Insert into the DB, the MID of each menu, its version and the image in base64 format
    menuListInsertDB = async (mid , version , img64) => {

        const query = `
                    INSERT INTO menuList (MID, Version, Img64)
                    VALUES (?, ?, ?)
                    ON CONFLICT(MID) DO NOTHING;
                    `

        try {

            await this.db.runAsync(query , [mid, version, img64])
            //console.log("menuListInsertDB -> info insert into DB")

        } catch (error) {
            console.log("menuListInsertDB -> Error occour during insert the info in DB" , error)
        }

    }

    // Get the image version from DB based on the MID
    getVersionMenu = async (mid) => {

        const query = 'SELECT Version FROM menuList WHERE MID = ?'

        try{
            const result = await this.db.getFirstAsync(query, [mid])
            //console.log("Version obtained")
            return result
            
        } catch (error) {
            console.log("getVersionMenuDB -> Error occour during obtaing the version from DB" , error)
        }
    }

    // Get the image from DB based on the MID
    getImageMenu = async (mid) => {

        const query = 'SELECT Img64 FROM menuList WHERE MID = ?'

        try{

            const result = await this.db.getFirstAsync(query, [mid])
            //console.log("Image obtained")
            return result

        } catch (error) {
            console.log("getImageMenu -> Error occour during obtaing the image from DB" , error)
        }
    }

    // Update the DB, inserting new version and image

    updateVersionImage = async (mid, version, img) => {

        const query = 'UPDATE menuList SET Version = ?, Img64 = ? WHERE MID = ?;'

        try{

        await this.db.runAsync(query, [version, img, mid])
        console.log("Update version and image for MID: " , mid)

        } catch (error){
            console.log("updateVersionImage -> Error occour during update the image and version from DB" , error)
        }
  }

    /* ------- Testing ------- */

    //Show the menu information saved in the DB
    menuListShowDB = async () => {

        const query = 'SELECT MID, Version FROM menuList'

        try {

            const result = await this.db.getAllAsync(query)
            console.log("Result: " , result)

        } catch (error) {
            console.log("Error occur :" , error)
        }

    }

}