import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

export default function Home2() {
    return (
        <View style={styles.page}>
            <Text>Text middle</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
    }
})
