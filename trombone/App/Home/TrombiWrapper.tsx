import React, { } from 'react';
import { StyleSheet } from 'react-native';
import HomeBackground from './HomeBackground';
import Trombinoscope from './Trombinoscope';

export default function TrombiWrapper() {

    return (<HomeBackground pageIndex={1}>
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
