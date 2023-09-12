import Colors from '@app/Colors';
import { Images } from '@app/Icons';
import React from 'react';
import { View, ViewProps, StyleSheet, Dimensions, ImageBackground } from 'react-native';

type HomeBackgroundProps = ViewProps & { pageIndex: number }

function HomeBackground(props: HomeBackgroundProps) {
    return (<View
        style={[styles.background, props.style]}
    >
        <View {...props}>
            {props.children}
        </View>
        <ImageBackground source={Images.login_bg} style={[styles.backgroundImage, {transform: [{scaleX: props.pageIndex % 2 === 0 ? 1 : -1}]}]} />
    </View>)
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.4,
    },
})

export default HomeBackground
