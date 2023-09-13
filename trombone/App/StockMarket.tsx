import React, { useEffect, useState } from "react";
import * as Api from "@app/ApiFinance"
import { ActivityIndicator, Image, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import Carousel from 'react-native-snap-carousel';
import Icons from "@app/Icons";

function transformMilliseconds(milis: number): string {
    const second = 1000;
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365.25

    if (milis > year) {
        const nb_years: number = Math.floor(milis / year)
        return String(nb_years) + " année" + (nb_years > 1 ? "s" : "")
    }
    if (milis > month) {
        const nb_month: number = Math.floor(milis / month)
        return String(nb_month) + " mois" + (nb_month > 1 ? "s" : "")
    }
    if (milis > week) {
        const nb_week: number = Math.floor(milis / week)
        return String(nb_week) + " semaine" + (nb_week > 1 ? "s" : "")
    }
    if (milis > day) {
        const nb_day: number = Math.floor(milis / day)
        return String(nb_day) + " jour" + (nb_day > 1 ? "s" : "")
    }
    if (milis > hour) {
        const nb_hour: number = Math.floor(milis / hour)
        return String(nb_hour) + " heure" + (nb_hour > 1 ? "s" : "")
    }
    if (milis > minute) {
        const nb_minute: number = Math.floor(milis / minute)
        return String(nb_minute) + " minute" + (nb_minute > 1 ? "s" : "")
    }
    return String(Math.floor(milis / second)) + " secondes";
}

function renderItem({ item }: { item: Api.ItemSummary }) {
    console.log(item)
    //@ts-expect-error
    const time = transformMilliseconds(item.lastDate - item.firstDate); const t2 = transformMilliseconds(new Date() - item.lastDate)

    const last = item.values[item.values.length - 1]
    const first = item.values[0]

    const diff = last - first
    const ratio = (diff / first) * 100;

    const color = diff >= 0 ? "darkgreen" : "red"

    return <View style={{
        flex: 1,
        paddingHorizontal: 20,
    }} >
        <Text style={styles.companyName}>{item.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={{ flex: 70, justifyContent: "space-around", height: "100%"}}>
                <View>
                    <Text style={styles.points}>{last.toFixed(2)}</Text>
                    <Text style={[styles.diff, { color }]}>{diff.toFixed(2)} ({ratio.toFixed(2)}%)</Text>
                    <Text style={styles.timeFrame}>Sur {time}</Text>
                </View>
            </View>
            <View style={{ flex: 30, width: "100%", aspectRatio: 1 }}>
                <Image style={{ width: "100%", height: "100%" }} tintColor={color} source={Icons.search} />
            </View>
        </View>
    </View>
}

const firstDate = new Date()
firstDate.setFullYear(2000)
const lastDate = new Date()

const mockData: Api.ItemSummary[] = [
    { firstDate, lastDate, name: "Hello", values: [7000, 7304.1] },
    { firstDate, lastDate, name: "CAC40", values: [7000, 974] },
    { firstDate, lastDate, name: "World", values: [7000, 7000] },
    { firstDate, lastDate, name: "Yoyo Ma", values: [7000, 6000] },
]

function StockMarket(): JSX.Element {
    const [data, setData] = useState<undefined | Api.ItemSummary[]>(undefined)
    const [viewWidth, setViewWidth] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)

    function fetchData() {
        setLoading(true)
        Api.getSummary().then(summary => {
            setData(summary)
            console.log(summary)
        }).catch(error => {
            console.error(error)
            Toast.show({
                type: "error",
                text1: "Erreur du chargement de la bourse",
            })
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
        const s = setInterval(() => fetchData(), 1000 * 60 * 5)
        return () => clearInterval(s)
    }, [])

    return <View style={styles.container} onLayout={event => {
        var { x, y, width, height } = event.nativeEvent.layout
        console.log(width)
        setViewWidth(width)
    }}>
        {
            data === undefined || loading ?
                <ActivityIndicator size={50} style={{ flex: 1, alignSelf: "center" }} />
                :

                <Carousel
                    renderItem={renderItem}
                    data={data}
                    sliderWidth={viewWidth}
                    itemWidth={viewWidth}
                    loop
                    autoplay
                    autoplayInterval={5000}
                />
        }
    </View>
}


const addInfo = {
    fontFamily: "ArchivoNarrow-Bold",
    color: "black",
    lineHeight: 25,
    fontSize: 23,
    marginTop: -5,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    companyName: {
        fontFamily: "ArchivoNarrow-Bold",
        fontSize: 42,
        color: "#0f69ff",
        textAlign: "center",
    }, points: {
        ...addInfo,
    },
    diff: {
        ...addInfo,
    },
    timeFrame: {
        ...addInfo,
    }
})

export default StockMarket
