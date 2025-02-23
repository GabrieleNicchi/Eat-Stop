export default class CommunicationController {
    
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
      //console.log("genericRequest called");
  
      const queryParamsFormatted = new URLSearchParams(queryParams).toString();
      let url = this.BASE_URL + endpoint

      if(verb === 'GET'){
         url += queryParamsFormatted;
      } 
      
  
      //console.log("Sending " + verb + " request to: " + url);
  
      let fetchData = {
        method: verb,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      if (verb !== "GET") {
        fetchData.body = JSON.stringify(bodyParams);
      }
  
      let httpResponse;
      try {
        httpResponse = await fetch(url, fetchData);
      } catch (error) {
        // This means that the fetch request failed.
        // The request could not be sent or the server did not respond.
        console.error("Error during fetch request: ", error);
        throw error;
      }
  
      const status = httpResponse.status;

      //console.log("HTTP response status: ", status);
      if (status === 200) {
        // 200 means that the request was successful.
        // The server responded with the data requested in JSON format.
        let deserializedObject = await httpResponse.json();
        return deserializedObject;
      } else if (status === 204) {
        // 204 means that the server has successfully processed the request
        // but that there is no content to send back.
        return null;
      } else if (status === 403) {
        //403 means that the card inserted by the user is not in a valid format
        return 403
      } else if (status === 409) {
        //409 means that user already have an active order
        return 409
      }else {
        
        // The server responded with an error status.
        const errorObject = await httpResponse.json();
        //console.error("Error message from the server:", errorObject);
        throw errorObject;
      }
    }

    /* --------------------------------------------- GET-Request --------------------------------------------- */
  
    static async genericGetRequest(endpoint, queryParams) {
      console.log("genericGetRequest called");
      return await this.genericRequest(endpoint, "GET", queryParams, {});
    }


    // The list of all nearby menus returns
    static async getMenuList(lat, lng, sid) {

        //console.log("getMenuList called")

        endpoint = "/menu?lat=" + lat + "&lng=" + lng + "&"
        queryParams = {sid : sid}

        //console.log("endpoint: " , endpoint)
        //console.log("queryparams: " , queryParams)

        return await this.genericGetRequest(endpoint, queryParams) 

      }

      // The image of a menu returns
      static async getMenuImage(mid, sid){

        //console.log("getMenuImage called")

        endpoint = "menu/" + mid + "/image?"
        queryParams = {sid : sid}

        //console.log("endpoint" , endpoint)
        //console.log("queryParams" , queryParams)

        return await this.genericGetRequest(endpoint, queryParams)
        
      }
      
      // Returns the registered user's information
      static async getUserInfo(uid, sid) {

        //console.log("getUserInfo called")

        endpoint = "user/" + uid + "?"
        queryParams = {sid : sid}
        
        return await this.genericGetRequest(endpoint, queryParams)
      }

      // Returns the details of a menu
      static async getMenuDetail(mid, lat, lng, sid) {

        //console.log("getMenuDetail called")

        endpoint = "menu/" + mid + "?lat=" + lat + "&lng=" + lng + "&"
        queryParams = {sid : sid}

        return await this.genericGetRequest(endpoint , queryParams)

      }

      // Returns the info of the user's order
      static async getOrderInfo(oid , sid) {

        //console.log("getOrder called")
        endpoint = "order/" + oid + "?"
        queryParams = {sid : sid}
        return await this.genericGetRequest(endpoint, queryParams)
  
      }

    /* --------------------------------------------- POST-Request --------------------------------------------- */

    static async genericPostRequest(endpoint , bodyParams) {
      console.log("genericPostRequest called")
      return await this.genericRequest(endpoint, "POST" , {} , bodyParams)
    }

    // Generates a new identifier associated with a user
    // Return -> sid : String , uid : Int
    static async postSid() {

        //console.log("getSid called")
        endpoint = "user"
        return await this.genericPostRequest(endpoint , {})
  
    }

    //Make a new order
    static async postOrder(mid, bodyparams){

      //console.log("postOrder called")
      endpoint = "menu/" + mid + "/buy"
      return await this.genericPostRequest(endpoint, bodyparams)

    }

    /* --------------------------------------------- PUT-Request --------------------------------------------- */

    static async genericPutRequest(endpoint, bodyParams) {
        console.log("genericPutRequest called")
        return await this.genericRequest(endpoint, "PUT" , {} , bodyParams)
    }

    // Enters user data
    // NB The request does not return any items
    static async putUserInfo(uid , bodyparams) {

      //console.log("putUserInfo called")
      endpoint = "user/" + uid
      return await this.genericPutRequest(endpoint, bodyparams)

    }

}