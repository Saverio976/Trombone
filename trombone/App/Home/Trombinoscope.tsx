import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const mockData: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 400, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8, 400, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8, 400, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8, 400, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8, 400, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 2, 3]
const itemWidth = 65;


function Separator() {
    return <View style={{ height: 30 }} />
}

var nb = 0

function renderItem(data: { item: number, index: number }): JSX.Element {
    return <View style={styles.item}>
        <View style={styles.image}></View>
        <Text style={styles.itemText} numberOfLines={1}>First {data.item * data.item * data.item}</Text>
        <Text style={styles.itemText} numberOfLines={1}>Second {data.item * data.item * data.item}</Text>
    </View>
}

function Trombinoscope(): JSX.Element {
    const height = 2;
    function Header(): JSX.Element {
        return <Text>Header</Text>
    }

    return (<View style={styles.background}>
        <FlatList
            ListHeaderComponent={Header}
            data={mockData}
            renderItem={renderItem}
            numColumns={3}
            contentContainerStyle={styles.flatListContainer}
            columnWrapperStyle={styles.columnWrapper}
            ItemSeparatorComponent={Separator}
            scrollEnabled={true}
            style={styles.flatList}
        />
    </View>)
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "white",
    },
    columnWrapper: {
        justifyContent: "space-between"
    },
    flatListContainer: {
        paddingHorizontal: 10,
        backgroundColor: "aquamarine",
    },
    flatList: {
        height: 250,
        marginVertical: 20,
        marginHorizontal: 10,
    },
    image: {
        width: itemWidth,
        height: 65,
        backgroundColor: "coral"
    },
    item: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: itemWidth
    },
    itemText: {
        width: itemWidth,
        textAlign: "center"
    }
})

export default Trombinoscope
