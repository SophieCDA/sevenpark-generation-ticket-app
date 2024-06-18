import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TabIconProps = {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await AsyncStorage.getItem("is_admin");
      setIsAdmin(adminStatus === "1");
    };

    checkAdminStatus();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Utilisateurs",
          href: !isAdmin ? null : "/users",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Utilisateurs"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-user"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Mon compte",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.param}
              color={color}
              name="Mon compte"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
