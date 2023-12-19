import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from "expo-web-browser"; // is a browser inside the application. This just works for ios
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from "@react-native-async-storage/async-storage"; // will save user info once they login so 
                                                                        //they don't have to login each time

WebBrowser.maybeCompleteAuthSession();

export default function App() {
// code used from video
// 1. 
const[userInfo, setUserInfo] = React.useState(null); //if null we know we don't have a user signing in
// 2. 
const [request, response, promptAsync] = Google.useAuthRequest({ //how this hook will know which application the user opened
  
  androidClientId: "525593244448-prii236jk7fsfbbj3h2bs67966vd8eqi.apps.googleusercontent.com",
  // iosClientId: "508324923582-qtv5h7tf8eub87iett2ek12hu6nflpv2.apps.googleusercontent.com",
  webClientId: "525593244448-1can3pi1b0644tabud4ftkuhhq4sve90.apps.googleusercontent.com"

  });
React.useEffect(() => {
  handleSignInWithGoogle();
}, [response])

// 5.
async function handleSignInWithGoogle(){
  const user = await AsyncStorage.getItem("@user");
  if (!user){
    //8.
    if (response?.type === "success"){

    // 7.
    await getUserInfo(response.authentication.accessToken);
    // 7.
  }
  }
  else{
    setUserInfo(JSON.parse(user));
  }
}

//6.
const getUserInfo = async(token) => { //get back response that contains the information of the user
  if(!token) return;
  try{
    const response = await fetch(
      "https://www.googleleapis.com/userinfo/v2/me",
      {
        headers: {Authorization: 'Bearer ${token}'},

      }
    );
    const user = await response.json();
    await AsyncStorage.setItem("@user", JSON.stringify(user)); // saves user locally so we have them in user key
    setUserInfo(user);
  }
  catch(error){

  }
}


// code used from video 


  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}!</Text>
      <Text>Code with bintSouleymane</Text>
      <Button title = "Sign in with Google" onPress={() => promptAsync()}/>
      <Button title = "Deconnect  with Google" onPress={ () => AsyncStorage.removeItem('@user')}/>


      {/* 4. -- Test running web and such. By this stage, it is not handling any requests*/}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
