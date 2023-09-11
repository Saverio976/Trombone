import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeBackground from './HomeBackground';
import Trombinoscope from './Trombinoscope';
import { Slider } from '@miblanchard/react-native-slider';
import Widget from '../Widget';

export default function Home2() {
    return (
        <HomeBackground pageIndex={2} style={{ justifyContent: 'space-between', flex: 1, }}>
            <Widget >
                <Trombinoscope />
            </Widget>
        </HomeBackground>
    );
}

const styles = StyleSheet.create({
    page: {
        height: "100%",
        backgroundColor: 'turquoise',
    }
})
