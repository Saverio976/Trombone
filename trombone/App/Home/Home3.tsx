import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeBackground from './HomeBackground';
import WeatherWidget from '../Weather';
import Widget from '../Widget';

export default function Home3() {
    return (
        <HomeBackground pageIndex={3}>
            <Widget>
                <WeatherWidget/>
            </Widget>
        </HomeBackground>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
    }
})
