import React, { useEffect, useState } from 'react';
import Colors from '@app/Colors';
import { StyleSheet, View, Image, Text } from 'react-native';
import Icons from '@app/Icons';
import HomeBackground from './HomeBackground';
import Fonts from '@app/Fonts';
import Button from '@app/Components/Button';

export default function Home1() {
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

    return (
        <HomeBackground style={{justifyContent: 'center'}} pageIndex={1}>
            <View style={styles.widget}>
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
                <View style={styles.botom}>
                    {isStarted ? (
                        <Text>minuteur en cours...</Text>
                    ) : (
                        <Button onPress={() => setIsStarted(true)} style={styles.button}>
                            <Text style={{marginVertical: 10, marginHorizontal: 20}}>Démarer</Text>
                        </Button>
                    )}
                </View>
            </View>
        </HomeBackground>
    );
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
    botom: {
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
})
