import React from 'react';
import { StyleSheet, View, SafeAreaView, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Header from './Header'; 

/* --------------- ProfileInfo  --------------- */ 

// Profile has two cases: 1 where the user needs to register, 1 where the user has already registered

function ProfileInfo({ profileBool, userData, 
    cardDetails ,handleScreen, handleSubmit, handleCardDetailsChange, handleHomeScreen, handleScreenMyOrder, handleDeRegisteredEvent }) {

    //If the user is already registered it shows the data obtained from the server

    if (profileBool) {

        //console.log("userData: " , userData)
        // Return component
        return (
            <SafeAreaView style={styles.container}>
                <Header 
                    valueScreen={"Profile"}
                    handleScreen={handleScreen} 
                    handleHomeScreen={handleHomeScreen}
                />
                <Text style={styles.title}>Your information:</Text>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>First Name:</Text>
                    <Text style={styles.itemValue}>{userData.firstName || 'N/A'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>Last Name:</Text>
                    <Text style={styles.itemValue}>{userData.lastName || 'N/A'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>Card Full Name:</Text>
                    <Text style={styles.itemValue}>{userData.cardFullName || 'N/A'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>Card Number:</Text>
                    <Text style={styles.itemValue}>{userData.cardNumber || 'N/A'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>Card Expiry Month:</Text>
                    <Text style={styles.itemValue}>{userData.cardExpireMonth || 'N/A'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>Card Expiry Year:</Text>
                    <Text style={styles.itemValue}>{userData.cardExpireYear || 'N/A'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>Card CVV:</Text>
                    <Text style={styles.itemValue}>{userData.cardCVV || 'N/A'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemKey}>Order Status:</Text>
                    <Text style={styles.itemValue}>{userData.orderStatus || 'N/A'}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleScreenMyOrder}>
                        <Text style={styles.buttonText}>View your last order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleDeRegisteredEvent}>
                        <Text style={styles.buttonText}>Change your info</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )

        //If the user has yet to register, it shows a form to fill out
        
    } else {

        // Return component
        return (
            <SafeAreaView style={styles.container}>
                <Header 
                    valueScreen={"Profile"}
                    handleScreen={handleScreen} 
                    handleHomeScreen={handleHomeScreen}
                />
                <View style={styles.container}>
                <Text style={styles.title}>Insert your information:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        value={cardDetails ? cardDetails.firstName : ''}
                        onChangeText={(value) => handleCardDetailsChange('firstName', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        value={cardDetails ? cardDetails.lastName : ''}
                        onChangeText={(value) => handleCardDetailsChange('lastName', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Card Full Name"
                        value={cardDetails ? cardDetails.cardFullName : ''}
                        onChangeText={(value) => handleCardDetailsChange('cardFullName', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Card Number"
                        value={cardDetails ? cardDetails.cardNumber : ''}
                        onChangeText={(value) => handleCardDetailsChange('cardNumber', value)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Card Expire Month"
                        value={cardDetails ? cardDetails.cardExpireMonth : ''}
                        onChangeText={(value) => handleCardDetailsChange('cardExpireMonth', value)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Card Expire Year"
                        value={cardDetails ? cardDetails.cardExpireYear : ''}
                        onChangeText={(value) => handleCardDetailsChange('cardExpireYear', value)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Card CVV"
                        value={cardDetails ? cardDetails.cardCVV : ''}
                        onChangeText={(value) => handleCardDetailsChange('cardCVV', value)}
                        keyboardType="numeric"
                        secureTextEntry
                    />
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    </View>
        
                </View>
            </SafeAreaView>
        )
    }
}

/* --------------- Style --------------- */

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#EEEFF1'
    },
    title: {
        fontSize: 24,
        padding: 10,
        fontWeight: 'bold',
        color: '#F96167',
        textAlign: 'center',
      },
      item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      itemKey: {
        fontWeight: 'bold',
        color: '#495057',
      },
      itemValue: {
        color: '#6c757d',
      },
      input: {
        height: 40,
        borderColor: '#F96167',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        margin: 10
      },
      buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop : 5
      },
      button: {
        height: 50, 
        width: '90%', 
        borderRadius: 10,
        backgroundColor: '#F96167',
        justifyContent: 'center',
        alignItems: 'center', 
        marginVertical: 10, 
    },
      buttonText: {
        color: '#EEEFF1',
        fontSize: 16,
        textAlign: 'center',
      },
})

export default ProfileInfo