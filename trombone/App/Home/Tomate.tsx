import { View, Image, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Fonts from "@app/Fonts";
import Icons from "@app/Icons";
import Button from "@app/Components/Button";
import Colors from "@app/Colors";

export default function Tomate(): JSX.Element {
    const [timeLeft, setTimeLeft] = useState(25)
    const [isStarted, setIsStarted] = useState(false)

    useEffect(() => {
        if (isStarted) {
            const interval = setInterval(() => {
                if (timeLeft > 0) {
                    setTimeLeft(timeLeft - 1)
                }
            }, 1000 * 60)
            return () => clearInterval(interval)
        }
    }, [timeLeft, isStarted])

    return <View style={styles.widget}>
        <View style={styles.title}>
            <Image source={Icons.tomato} style={styles.tomato} />
            <Text style={styles.textTitle}>Technique Pomodoro</Text>
        </View>
        <View style={styles.middle}>
            {isStarted ? (
                <Text style={Fonts.H1}>Plus que</Text>
            ) : (
                <></>
            )}
            <Text style={Fonts.H1}>
                {timeLeft} min
            </Text>
        </View>
        <View style={styles.bottom}>
            {isStarted ? (
                <Text>minuteur en cours...</Text>
            ) : (
                <Button onPress={() => setIsStarted(true)} style={styles.button}>
                    <Text style={{ marginVertical: 10, marginHorizontal: 20 }}>Démarer</Text>
                </Button>
            )}
        </View>
    </View>
}

const styles = StyleSheet.create({
    widget: {
        backgroundColor: Colors.secondary,
        borderRadius: 50,
    },
    title: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    middle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        marginBottom: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tomato: {
        width: 37,
        height: 33,
    },
    button: {
        borderRadius: 500,
        backgroundColor: Colors.gradient1,
    },
    textTitle: {
        ...Fonts.H2,
        marginLeft: 10,
    },
    inputBoxTitle: {
        ...Fonts.text,
        color: Colors.text,
        marginTop: 6,
    },
    innerInputBox: {
        flex: 1,
    },
    inputBox: {
        backgroundColor: Colors.light,
        elevation: 10,
        shadowColor: "0x40000000",
        borderRadius: 2,
        flexDirection: "row",
        alignContent: "center",
    },
    inputBoxIcon: {
        marginLeft: 14,
        marginRight: 15,
        width: 33,
        alignSelf: "center",
        resizeMode: "contain",
    },
    inputBoxInput: {
        ...Fonts.text,
        margin: 0,
        padding: 0,
        marginRight: 10,
        marginBottom: 10,
        borderBottomColor: "#000",
        // borderBottomWidth: 1,
        color: "#000",
    }
})
