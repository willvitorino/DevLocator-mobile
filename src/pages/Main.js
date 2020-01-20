import React, { useState, useEffect } from 'react'
import MapView, { Marker, Callout } from 'react-native-maps'
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

/** */
import api from '../services/api'


function Main( { navigation } ) {

  const [devs, setDevs] = useState([])
  const [ techs, setTechs ] = useState('')
  const [currentRegion, setCurrentRegion] = useState(null)

  useEffect(
    () => {
      async function getLocation() {

        const { granted } = await requestPermissionsAsync()

        if (granted) {
          const { coords } = await getCurrentPositionAsync({ enableHighAccuracy: true })

          const { latitude, longitude } = coords

          setCurrentRegion({
            latitude,
            longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04
          })
        }
      }

      getLocation()
      populateDevs()
    }, []
  )

  async function populateDevs () {
    const response = await api.get('/devs')
    setDevs(response.data)
  }

  /**
   * Buscar Devs.
   */
  async function loadDevs () {
    const { latitude, longitude } = currentRegion

    const response = await api.get('/search', {
      params: { latitude, longitude, techs }
    })
    setDevs(response.data)
  }

  return currentRegion ? (
    <>
      <MapView onRegionChangeComplete={setCurrentRegion} initialRegion={currentRegion} style={styles.container} >
        {devs.map(
          dev => {
            return (
              <Marker
                key={dev._id}
                coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}
              >
                <Image style={styles.avatar} source={{ uri: dev.avatar_url }} ></Image>
                <Callout
                  onPress={
                    () => {
                      navigation.navigate('Profile', { github_username: dev.github_username } )
                    }
                  }
                >
                  <View style={styles.callout} >
                    <Text style={styles.devName} >{ dev.name }</Text>
                    <Text style={styles.bio} >{ dev.bio }</Text>
                    <Text style={styles.techs} >{ dev.techs.join(', ') }</Text>
                  </View>
                </Callout>
              </Marker>
            )
          }
        )}
      </MapView>

      <View style={ styles.searchForm } >
        <TextInput
          style={ styles.searchInput }
          placeholder="Buscar por Tecnologias"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={ false }
          value={ techs }
          onChangeText={ setTechs }
        ></TextInput>

        <TouchableOpacity
          style={styles.loadButton}
          onPress={loadDevs}
        >
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  ) : (
      <MapView style={styles.container} />
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'black'
  },
  
  callout: {
    width: 260,
  },
  
  devName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  
  bio: {
    color: '#666',
    marginTop: 5
  },
  
  techs: {
    marginTop: 5
  },
  
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },
  
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    // iOs
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    // Android
    elevation: 9
  },
  
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8d4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
});

export default Main