import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import Fonts from "@app/Fonts";
import { Images } from "@app/Icons";
import { LinearGradient } from 'react-native-gradients';

// const c = "clear_sky"
// const m = "mainly_clear"
// const f = "fog"
// const d = "drizzle"
// const r = "rain"
// const fr = "freezing_rain"
// const sf = "snow_fall"
// const sg = "snow_grains"
// const rs = "rain_showers"
// const ss = "snow_showers"
// const t = "thunderstorm"
// const th = "thunderstorm_hail"

const codeTable = {
    0: "c",
    1: "m", 2: "m", 3: "m",
    45: "f", 48: "f",
    51: "d", 53: "d", 55: "d",
    61: "r", 63: "r", 65: "r",
    66: "fr", 67: "fr",
    71: "sf", 73: "sf", 75: "sf",
    77: "sg",
    80: "rs", 81: "rs", 82: "rs",
    85: "ss", 86: "ss",
    95: "t",
    96: "th", 99: "th",
}

const c1 = { color: "#ff0000", opacity: '1' }
const c2 = { color: "#00ff00", opacity: '1' }
const c3 = { color: "#0000ff", opacity: '1' }
const c4 = { color: "#ff00ff", opacity: '1' }
const c5 = { color: "#ffff00", opacity: '1' }

const gradientTable = {
    "c": [{ ...c1, offset: '0%' }, { ...c2, offset: '100%' }],
    "m": [{ ...c1, offset: '0%' }, { ...c3, offset: '100%' }],
    "f": [{ ...c1, offset: '0%' }, { ...c4, offset: '100%' }],
    "d": [{ ...c1, offset: '0%' }, { ...c5, offset: '100%' }],
    "r": [{ ...c2, offset: '0%' }, { ...c1, offset: '100%' }],
    "fr": [{ ...c2, offset: '0%' }, { ...c3, offset: '100%' }],
    "sf": [{ ...c2, offset: '0%' }, { ...c4, offset: '100%' }],
    "sg": [{ ...c2, offset: '0%' }, { ...c5, offset: '100%' }],
    "rs": [{ ...c3, offset: '0%' }, { ...c4, offset: '100%' }],
    "ss": [{ ...c3, offset: '0%' }, { ...c5, offset: '100%' }],
    "t": [{ ...c4, offset: '0%' }, { ...c5, offset: '100%' }],
    "th": ["#000", "#fff"],
}

interface WeatherApiResponse {
    timezone: string;
    timezone_abbreviation: string;
    elevation: number
    hourly_units: {
        time: string;
        temperature_2m: string
        weathercode: string;
    }
    hourly: {
        time: string[];
        temperature_2m: number[];
        weathercode: number[];
    }
}
function WeatherWidget(): JSX.Element {
    const [rawData, setRawData] = useState<WeatherApiResponse | undefined>(undefined)
    const [temp, setTemp] = useState<number | undefined>(undefined)
    const [weatherCode, setWeatherCode] = useState<number | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)
    var uiInterval: NodeJS.Timeout;

    useEffect(() => {
        getWeather()
    }, [])

    useEffect(() => {
        clearInterval(uiInterval)
        updateLocalData()
        uiInterval = setInterval(updateLocalData, 30 * 60 * 1000)
    }, [rawData])

    function updateLocalData() {
        if (rawData != undefined) {
            var now = new Date();
            now.setMinutes(0, 0, 0)

            var index = rawData.hourly.time.findIndex(predicate => String(new Date(predicate)) === String(now));
            if (index == -1) {
                return;
            }
            setTemp(rawData.hourly.temperature_2m[index])
            setWeatherCode(rawData.hourly.weathercode[index])
        }
    }

    function getWeather() {
        setLoading(true)
        fetch("https://api.open-meteo.com/v1/forecast?latitude=43.6043&longitude=1.4437&hourly=temperature_2m,weathercode&timezone=Europe%2FLondon&forecast_days=2")
            .then(async response => {
                const item = await response.json()
                if (response.status / 100 === 2) {
                    setRawData(item)
                } else {
                    console.error(item)
                    Toast.show({
                        type: 'error',
                        text1: "Impossible de récupérer les données météos"
                    })
                }
            })
            .catch(err => {
                console.error(err)
                Toast.show({
                    type: 'error',
                    text1: "Erreure fatale",
                    text2: "Impossible de récupérer les donnée météos"
                })
            })
            .finally(() => { setLoading(false) })
    }

    return <View style={styles.container}>
        <View style={styles.absolute}>
            {/*@ts-expect-error*/}
            <LinearGradient colorList={gradientTable[weatherCode === undefined ? "m" : codeTable[weatherCode]]} angle={90} />
        </View>
        <View style={styles.tempContainer}>
            <Text style={styles.temp} numberOfLines={1}>{temp === undefined ? " " : String(temp) + rawData?.hourly_units.temperature_2m}</Text>
        </View>
        <View style={{ width: "100%", alignContent: "center", backgroundColor: "white", flexDirection: "column" }} >
        </View>
        <View style={styles.iconWrapper}>
            {weatherCode === undefined ? <View style={styles.icon} /> :
                //@ts-expect-error
                <Image style={styles.icon} source={Images.weather[codeTable[weatherCode]]} />
            }
        </View>
    </View >
}

const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        backgroundColor: "skyblue",
        borderRadius: 10,

    },
    tempContainer: {
        alignItems: "center",
    },
    temp: {
        ...Fonts.H1
    },
    icon: {
        width: 100,
        height: 100,
    },
    iconWrapper: {
        width: "100%",
        alignItems: "center",
    }
});

export default WeatherWidget
