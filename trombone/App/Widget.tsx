import React from "react";
import { Dimensions, StyleSheet, View } from 'react-native';


interface WidgetProps {
    children: JSX.Element,
}

function Widget({ children }: WidgetProps) {

    return <View style={styles.widgetWrapper}>
        {children}
    </View>
}

const styles = StyleSheet.create({
    widgetWrapper: {
        borderRadius: 10,
        alignSelf: "stretch",
        elevation: 10,
        backgroundColor: "white",
        marginHorizontal: 24,
    }
})

export default Widget
