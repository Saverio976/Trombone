import Colors from '@app/Colors';
import React from 'react';
import { View, Text, ViewProps, StyleSheet } from 'react-native';

type HomeBackgroundProps = ViewProps & { pageIndex: number }

function HomeBackground(props: HomeBackgroundProps) {
    return (<View
        style={[styles.background, props.style]}
    >
        <View {...props}>
            {props.children}
        </View>
    </View>)
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
})

export default HomeBackground
