import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeBackground from './HomeBackground';

export default function Home1() {
    return (
        <HomeBackground pageIndex={1}>
            <Text>Home 1</Text>
        </HomeBackground>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
    }
})
