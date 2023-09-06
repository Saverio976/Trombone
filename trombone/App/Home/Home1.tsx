import React from 'react';
import Colors from '@app/Colors';
import { StyleSheet, View, Text, Image } from 'react-native';
import Icons from '@app/Icons';

export default function Home1() {
    return (
        <View style={styles.page}>
            <View style={styles.widget}>
                <Image source={Icons.tomato} style={styles.tomato} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'turquoise',
        justifyContent: 'center',
        alignContent: 'center',
    },
    widget: {
        backgroundColor: Colors.secondary,
        height: '90%',
        width: '90%',
    },
    tomato: {
        width: 33,
        height: 33,
    }
})
