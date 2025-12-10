import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import LiveRadioScreen from "../screens/LiveRadioScreen";
import PlaylistScreen from "../screens/PlaylistScreen";
import ProfileScreen from "../screens/ProfileScreen";
const Tab=createBottomTabNavigator();
export default function TabNavigator(){return(<Tab.Navigator><Tab.Screen name="Inicio" component={HomeScreen}/><Tab.Screen name="Radio" component={LiveRadioScreen}/><Tab.Screen name="Playlist" component={PlaylistScreen}/><Tab.Screen name="Perfil" component={ProfileScreen}/></Tab.Navigator>);}
