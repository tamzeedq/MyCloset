import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'


const Item = () => {
    const { id } = useLocalSearchParams();

    return (
    <View>
        <Text>Item</Text>
    </View>
    )
}

export default Item