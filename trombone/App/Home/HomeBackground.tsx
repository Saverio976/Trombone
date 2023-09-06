import Colors from '@app/Colors';
import React from 'react';
import { View, Text, ViewProps, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type HomeBackgroundProps = ViewProps & {pageIndex: number}

function HomeBackground(props: HomeBackgroundProps) {
    const n1 = props.pageIndex % 2 === 0 ? 0 : 1;
    const n2 = props.pageIndex % 2 === 0 ? 1 : 0;

    return (<LinearGradient
        start={{ x: n1, y: 1 }}
        end={{ x: n2, y: 0 }}
        colors={[Colors.gradient1, Colors.gradient2, Colors.gradient3]}
        locations={[0, 0.1, 1]}
        style={[styles.background, props.style]}
    >
        <View {...props}>
            {props.children}
        </View>
    </LinearGradient>)
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        padding: 20,
    },
})

export default HomeBackground
