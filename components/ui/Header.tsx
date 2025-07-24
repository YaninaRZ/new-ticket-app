import React from 'react';
import { View, Text } from 'react-native';
import { HStack, Pressable, Icon } from '@gluestack-ui/themed';
import { Menu } from 'lucide-react-native';

type HeaderProps = {
  onMenuPress: () => void;
};

export default function Header({ onMenuPress }: HeaderProps) {
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
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ticket App</Text>

      <Pressable onPress={onMenuPress}>
        <Icon as={Menu} style={{ width: 24, height: 24 }} />
      </Pressable>
    </HStack>
  );
}
