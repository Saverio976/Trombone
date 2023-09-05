import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Home1() {
    return (
        <View style={styles.page}>
            <Text>Text middle 1</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
    }
})
