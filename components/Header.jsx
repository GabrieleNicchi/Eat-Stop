import { StyleSheet, View, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native';

/* --------------- Header  --------------- */ 

function Header({ handleScreen, valueScreen, handleHomeScreen }) {

    
    if(valueScreen != "Home" && valueScreen != "Error"){
        
        // Return component
        return (
            <View style={styles.container}>
                
                {/* StatusBar */}
                <StatusBar barStyle="dark-content" backgroundColor="#FFB6C1" />
    
                {/* Back-Button */}
                <TouchableOpacity style={styles.button} onPress={handleScreen}>
                    <Image source={require('../assets/back.png')} style={styles.image} />
                </TouchableOpacity>
    
    
                {/* Home-Button */}
                <TouchableOpacity style={styles.button} onPress={handleHomeScreen}>
                    <Image source={require('../assets/house.png')} style={styles.image} />
                </TouchableOpacity>
    
            </View>
        )

    } 
}

/* --------------- Style --------------- */

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F96167',
        padding: 20, 
        paddingTop: 22, 
    },
    button: {
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        backgroundColor: '#F96167',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: {
        flex: 1,
        height: 50, 
        backgroundColor: '#EEEFF1',
        borderRadius: 25, 
        paddingHorizontal: 15, 
        marginHorizontal: 15, 
    },
    image: {
        width: 50, 
        height: 50 
    }
})

export default Header