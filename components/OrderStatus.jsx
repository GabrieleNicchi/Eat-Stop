import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import { getCoords, formatDate } from '../viewmodel/LocationViewModel';
import { getMenuDetail } from '../viewmodel/AppViewModel';
import Header from './Header';
import LoadingScreen from './LoadingScreen';

/* --------------- OrderStatus  --------------- */ 

export function OrderStatus({ orderInfo , refreshOrderInfo, handleScreen, handleHomeScreen }) {

    // Store user's current position
    const [myPosition, setMyPosition] = useState(null)

    // Store name of the purchased menu
    const [menu, setMenu] = useState(null)

    const [formattedCreationTime, setFormattedCreationTime] = useState(null)
    const [formattedDeliveryTime, setFormattedDeliveryTime] = useState(null)
    const [formattedDeliveryTimeStamp , setDeliveryTimeStamp] = useState(null)

    /* --------------- Update Map  --------------- */ 

    // Map update logic every 5 seconds
    let intervalId

    const onLoad = () => {
        //console.log("Component mounted")
        intervalId = setInterval(() => {
            refreshOrderInfo() // Call to update the component
        }, 5000) // Every 5 seconds
    }

    const onUnload = () => {
        //console.log("Component disassembled")
        clearInterval(intervalId)
    }

    useEffect(() => {
        onLoad() //When component mounted
        return onUnload // Clear when component disassembled
    }, [])

    /* --------------- Fetch position and format time --------------- */ 

    useEffect(() => {
        const fetchPositionAndFormatTimes = async () => {
            try {
                const location = await getCoords()
                setMyPosition(location)

                const fcTime = formatDate(orderInfo.creationTimestamp)
                const edTime = formatDate(orderInfo.expectedDeliveryTimestamp)

                if(orderInfo.deliveryTimestamp != null){
                    const dtTime = formatDate(orderInfo.deliveryTimestamp)
                    setDeliveryTimeStamp(dtTime)
                }

                setFormattedCreationTime(fcTime)
                setFormattedDeliveryTime(edTime)
            } catch (error) {
                console.log("OrderStatus --> Error in position calculation", error)
            }
        }

        if (orderInfo) {
            fetchPositionAndFormatTimes()
        }
    }, [orderInfo])

    /* --------------- Get details menu --------------- */ 

    useEffect(() => {
        const RecoverDetailsMenu = async () => {
            try {
                if (myPosition) {
                    const response = await getMenuDetail(orderInfo.mid, myPosition.latitude, myPosition.longitude)
                    setMenu(response)
                }
            } catch (error) {
                console.log("OrderStatus --> Error in getting the menu ", error)
            }
        }

        RecoverDetailsMenu()
    }, [myPosition])

    /* --------------- Testing --------------- */ 

    /* useEffect(() => {
        console.log("My position: ", myPosition)
    }, [myPosition]) */

    if (orderInfo) {
        // Return component
        return (
            <SafeAreaView style={styles.container}>
                <Header 
                    valueScreen={"MyOrder"}
                    handleScreen={handleScreen} 
                    handleHomeScreen={handleHomeScreen}
                />
                {orderInfo && myPosition && menu ? (
                    <SafeAreaView style={styles.container}>
                        <View style={[styles.mapContainer, styles.mapBorder]}>
                            <MapView
                                style={styles.map}
                                showsCompass={true}
                                showsMyLocationButton={true}
                                showsUserLocation={true}
                                zoomControlEnabled={true}
                                loadingEnabled={true}
                                region={{
                                    latitude: myPosition.latitude,
                                    longitude: myPosition.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: orderInfo.deliveryLocation.lat,
                                        longitude: orderInfo.deliveryLocation.lng,
                                    }}
                                    title="Order location"
                                    description="The order will arrive at this point"
                                    pinColor="blue"
                                />
                                <Marker
                                    coordinate={{
                                        latitude: orderInfo.currentPosition.lat,
                                        longitude: orderInfo.currentPosition.lng,
                                    }}
                                    title="Your order"
                                    description="We're coming!"
                                />
                                <Polyline
                                    coordinates={[
                                        {
                                            latitude: orderInfo.deliveryLocation.lat,
                                            longitude: orderInfo.deliveryLocation.lng,
                                        },
                                        {
                                            latitude: orderInfo.currentPosition.lat,
                                            longitude: orderInfo.currentPosition.lng,
                                        },
                                    ]}
                                    strokeColor="green"
                                    strokeWidth={3}
                                />
                                <Marker 
                                    coordinate={{
                                        latitude: myPosition.latitude,
                                        longitude: myPosition.longitude,
                                    }}
                                    title="Me"
                                    description="My position"
                                    pinColor='yellow'
                                />
                            </MapView>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.menuName}>{menu.name}</Text>
                            <Text style={styles.status}>Status: {orderInfo.status}</Text>
                            <Text style={styles.timestamp}>Time the order was placed: {formattedCreationTime}</Text>
                            {formattedDeliveryTimeStamp ? (
                                <Text style={styles.timestamp}>Time the order arrived: {formattedDeliveryTimeStamp}</Text>
                            ) : ( 
                                <Text style={styles.timestamp}>Estimated delivery time: {formattedDeliveryTime}</Text>
                            )}
                        </View>
                    </SafeAreaView>
                ) : (
                    <SafeAreaView >
                        <LoadingScreen />
                    </SafeAreaView>
                )}
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <Header 
                    valueScreen={"MyOrder"}
                    handleScreen={() => handleScreen()} 
                    handleHomeScreen={handleHomeScreen}
                />
            
                <Text style={styles.menuName}>There are no active orders!</Text>
            
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEFF1',
    },
    mapContainer: {
        height: '40%', 
        marginBottom: 20,
        margin: 10,
    },
    mapBorder: {
        borderWidth: 3,
        borderColor: '#F96167',
        borderRadius: 8,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        marginHorizontal: 20,
        marginBottom: 15,
    },
    menuName: {
        color: '#F96167',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    status: {
        fontSize: 18,
        color: '#665',
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 16,
        color: '#665',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default OrderStatus