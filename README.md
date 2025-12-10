# klk-radio-app
radio live show
# KLK Radio App 🎧🔥

Aplicación móvil para escuchar KLK Radio Show en vivo.  
Construida con **React Native + Expo** y lista para compilar en **APK / AAB** con EAS Build.

---

## 🚀 Funciones

- Pantalla de portada animada (Cover)
- Player moderno con animación de visualizer
- Streaming en vivo:  
  **https://klkradioshow.radiostream321.com/stream**
- Navegación con React Navigation
- Proyecto listo para Play Store

---

## 📦 Instalar dependencias

```bash
npm install
expo start
eas build -p android --profile preview
eas build -p android --profile production
/assets
/src
  /screens
  /navigation
  /components
App.js
app.json
eas.json
package.json
README.md

---

# 🔥 **PASO 3 — TE ENTREGO TODOS LOS ARCHIVOS DEL PROYECTO**
Aquí están **TODOS LOS ARCHIVOS EXACTAMENTE COMO DEBEN IR**.

---

## 📁 **FOLDER: raíz del proyecto**

### **App.js**
```js
import AppNavigator from "./src/navigation/AppNavigator";
export default function App() {
  return <AppNavigator />;
}
{
  "expo": {
    "name": "KLK Radio Show",
    "slug": "klk-radio-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/logo.png",
    "splash": {
      "image": "./assets/logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#071028"
    },
    "android": {
      "package": "com.klkradio.show"
    },
    "assetBundlePatterns": ["**/*"]
  }
}
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
{
  "name": "klk-radio-app",
  "version": "1.0.0",
  "main": "App.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/stack": "^7.0.0",
    "expo": "^51.0.0",
    "expo-av": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "~4.4.0"
  }
}
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import CoverScreen from "../screens/CoverScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Cover" component={CoverScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import LiveRadioScreen from "../screens/LiveRadioScreen";
import PlaylistScreen from "../screens/PlaylistScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Radio" component={LiveRadioScreen} />
      <Tab.Screen name="Playlist" component={PlaylistScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function CoverScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace("MainTabs"), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>KLK Radio Show</Text>
      <TouchableOpacity style={styles.enterBtn} onPress={() => navigation.replace("MainTabs")}>
        <Text style={styles.enterTxt}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#071028"},
  logo:{width:150,height:150,borderRadius:75,marginBottom:20},
  title:{color:"#fff",fontSize:28,fontWeight:"700"},
  enterBtn:{marginTop:20,backgroundColor:"#ff4d6d",padding:12,borderRadius:20},
  enterTxt:{color:"#fff",fontWeight:"700",fontSize:18}
});
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.hi}>Bienvenido a KLK Radio Show 🔥</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Radio")}>
        <Text style={styles.btnText}>Ir a Radio en Vivo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#071028"},
  hi:{color:"#fff",fontSize:24,marginBottom:20},
  btn:{backgroundColor:"#ff4d6d",padding:16,borderRadius:12},
  btnText:{color:"#fff",fontWeight:"700"}
});
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from "react-native";
import { Audio } from "expo-av";
import AudioVisualizer from "../components/AudioVisualizer";

const STREAM_URL = "https://klkradioshow.radiostream321.com/stream";

export default function LiveRadioScreen() {
  const [soundObj, setSoundObj] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (soundObj) {
        soundObj.unloadAsync();
      }
    };
  }, [soundObj]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 700, useNativeDriver: true })
      ])
    ).start();
  }, []);

  async function togglePlay() {
    try {
      if (!isPlaying) {
        setBuffering(true);
        const { sound } = await Audio.Sound.createAsync(
          { uri: STREAM_URL },
          { shouldPlay: true },
          onPlaybackStatus
        );
        setSoundObj(sound);
        setIsPlaying(true);
      } else {
        if (soundObj) {
          await soundObj.stopAsync();
          await soundObj.unloadAsync();
        }
        setSoundObj(null);
        setIsPlaying(false);
      }
    } catch (e) {
      console.warn(e);
      setIsPlaying(false);
    } finally {
      setBuffering(false);
    }
  }

  function onPlaybackStatus(status) {
    if (status.isBuffering !== undefined) setBuffering(status.isBuffering);
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ scale: pulse }] }]}>
        <Text style={styles.logoTxt}>KLK</Text>
      </Animated.View>

      <Text style={styles.title}>Radio en Vivo</Text>

      {buffering ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#fff" />
      ) : (
        <AudioVisualizer isPlaying={isPlaying} />
      )}

      <TouchableOpacity
        style={[styles.playBtn, { backgroundColor: isPlaying ? "#ff375f" : "#00c2a8" }]}
        onPress={togglePlay}
      >
        <Text style={styles.playText}>{isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#071028"},
  circle:{width:150,height:150,borderRadius:75,backgroundColor:"#0f1724",alignItems:"center",justifyContent:"center",borderWidth:6,borderColor:"#ff4d6d",marginBottom:20},
  logoTxt:{color:"#fff",fontSize:36,fontWeight:"900"},
  title:{color:"#fff",fontSize:22,fontWeight:"700",marginBottom:20},
  playBtn:{marginTop:30,paddingVertical:14,paddingHorizontal:36,borderRadius:30},
  playText:{color:"#fff",fontWeight:"700",fontSize:18}
});
import React from "react";
import { View, Text } from "react-native";

export default function PlaylistScreen() {
  return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
      <Text>Playlist (próximamente)</Text>
    </View>
  );
}
import React from "react";
import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
      <Text>Perfil</Text>
    </View>
  );
}
import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export default function AudioVisualizer({ isPlaying=false }) {
  const bars = [
    useRef(new Animated.Value(4)).current,
    useRef(new Animated.Value(6)).current,
    useRef(new Animated.Value(5)).current
  ];

  useEffect(() => {
    let running = true;

    function animate() {
      if (!running) return;

      const sequences = bars.map(b =>
        Animated.sequence([
          Animated.timing(b, { toValue: isPlaying ? Math.random()*18 + 4 : 4, duration: 220, useNativeDriver: false }),
          Animated.timing(b, { toValue: isPlaying ? Math.random()*18 + 4 : 4, duration: 220, useNativeDriver: false })
        ])
      );

      Animated.parallel(sequences).start(() => {
        if (running) animate();
      });
    }

    animate();
    return () => { running = false; };
  }, [isPlaying]);

  return (
    <View style={{flexDirection:"row", alignItems:"flex-end", height:28}}>
      {bars.map((b, i) => (
        <Animated.View
          key={i}
          style={{
            width:6,
            marginHorizontal:4,
            backgroundColor:"#fff",
            borderRadius:3,
            height: b
          }}
        />
      ))}
    </View>
  );
}
