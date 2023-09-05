import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Home4() {
    return (
        <View style={styles.page}>
            <Text>Text middle 4</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
    }
})
