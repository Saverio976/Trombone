import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Home3() {
    return (
        <View style={styles.page}>
            <Text>Text middle 3</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
    }
})
