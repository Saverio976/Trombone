import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
//@ts-expect-error
import AnalogClock from 'react-native-clock-analog';

const nowDate = () => {
    const d = new Date();
    let second = d.getSeconds();
    let minute = d.getMinutes();
    let hour = d.getHours();
    return { second, minute, hour };
};

export function Digital(): JSX.Element {
    const { second, minute, hour } = nowDate();
    const [state, setState] = useState({ second, minute, hour })

    useEffect(() => {
        const int = setInterval(() => {
            const { second, minute, hour } = nowDate();
            setState({ second, minute, hour });
        }, 1000);
        return () => { clearInterval(int) }
    }, [useState]);
    return <View style={styles.container}>
        <Text style={styles.digital}>{state.hour.toString().padStart(2, '0')}{"\n"}{state.minute}</Text>
    </View>
}


export function Analog(): JSX.Element {
    const { second, minute, hour } = nowDate();
    const [state, setState] = useState({ second, minute, hour })

    useEffect(() => {
        const int = setInterval(() => {
            const { second, minute, hour } = nowDate();
            setState({ second, minute, hour });
        }, 100);
        return () => { clearInterval(int) }
    }, [useState]);

    return (
        <View style={styles.container}>
            <AnalogClock
                colorClock="#2196F3"
                colorNumber="#000000"
                colorCenter="#00BCD4"
                colorHour="#FF8F00"
                colorMinutes="#FFC400"
                showSeconds
                size={130}
            />
        </ View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    digital: {
        fontSize: 60,
        lineHeight: 62,
        marginTop: 20,
        color: "black",
        letterSpacing: -3,
        fontFamily: "ArchivoNarrow-Bold"
    }
});
