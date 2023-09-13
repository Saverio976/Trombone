import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import HomeBackground from './HomeBackground';
import Trombinoscope from './Trombinoscope';

export default function Home2({}) {

    return (<HomeBackground pageIndex={2}>
        <Trombinoscope/>
    </HomeBackground>
    );
}

const styles = StyleSheet.create({
    page: {
        height: "100%",
        backgroundColor: 'turquoise',
    }
})
