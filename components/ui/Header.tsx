
import { View, Text } from 'react-native';
import { HStack, Pressable, Icon } from '@gluestack-ui/themed';
import { Menu } from 'lucide-react-native';
import { Image } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
type HeaderProps = {
  onMenuPress: () => void;
};


export default function Header({ onMenuPress }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter(); 
  return (
    <HStack
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
      }}
    >
      <Pressable
  onPress={() => {
    setIsDrawerOpen(false);
    router.push("/home");
  }}
>
  <Image
    source={require("@/assets/images/Frame.png")}
    style={{ width: 80, height: 28, resizeMode: "contain" }}
  />
</Pressable>


      <Pressable onPress={onMenuPress}>
        <Icon as={Menu} style={{ width: 24, height: 24 }} />
      </Pressable>
    </HStack>
  );
}
