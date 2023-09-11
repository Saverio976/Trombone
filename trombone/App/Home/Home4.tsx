import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeBackground from './HomeBackground';
import { Widgets } from './Widgets/Widgets';

export default function Home4() {
    return (
        <HomeBackground pageIndex={4}>
            <Widgets />
        </HomeBackground>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
    }
})
