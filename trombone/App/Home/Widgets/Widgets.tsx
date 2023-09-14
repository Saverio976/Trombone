import WeatherWidget from "@app/App/Weather"
import { StyleSheet, View, Text, FlatList, Touchable, TouchableWithoutFeedback, Alert, TouchableHighlight, TouchableOpacity } from "react-native"
import Tomate from "../Tomate"
import Todos from "../Todo"
import Notes from "../Note"
import StockMarket from "@app/App/StockMarket"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import { Image } from "react-native-elements"
import Icons from "@app/Icons"
import { useCallback, useEffect, useState } from "react"
import { Modal } from "react-native"
import { Button } from "react-native-paper"

const asyncStorageKey = "WidgetConfig"

function Separator() {
    return <View style={{ height: margin }} />
}

export const Widgets = (): JSX.Element => {
    const [optionsVisible, setOptionsVisible] = useState<boolean>(false)
    const [addVisible, setAddVisible] = useState<boolean>(false)
    const [addType, setAddType] = useState<undefined | WidgetSize>(undefined)
    const [pos, setPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })


    const [id, setId] = useState<number>(0)
    const [widgets, setWidgets] = useState<WidgetItem[] | undefined>(undefined)

    async function fetchData() {
        try {
            const localStorage = await AsyncStorage.getItem(asyncStorageKey)
            if (localStorage === null) {
                setWidgets(allWidgets)
            } else {
                setWidgets(JSON.parse(localStorage))
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Impossible de charger la configuration des widgets"
            })
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    async function SaveData(data: WidgetItem[]) {
        await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(data))
    }

    useEffect(() => {
        if (widgets === undefined) {
        } else {
            SaveData(widgets)
        }
    }, [widgets, setWidgets])

    function renderSmall(data: IdElement | null, x: number, y: number) {
        return data === null ?
            <EmptySmallWidget x={x} y={y} />
            :
            //@ts-ignore
            onLongPressWrapper(<View style={styles.litleBlock}>{widgetTable[data.name].element}</View>, data.id)
    }

    function renderMedium(data: IdElement | null) {
        return data === null ?
            <EmptyMediumWidget />
            :
            //@ts-ignore
            <View style={styles.litleBlock}>{widgetTable[data.name].element}</View>
    }

    function renderBig(data: IdElement | null) {
        return data === null ?
            <EmptyBigWidget />
            :
            //@ts-ignore
            <View style={styles.oneBigBlock}>{widgetTable[data.name].element}</View>
    }


    const onLongPressWrapper = useCallback((element: JSX.Element, id: number | undefined) => {
        return <View style={{ flex: 1 }} >
            <TouchableOpacity style={{ position: "absolute", top: 10, right: 10, aspectRatio: 1, width: 20, zIndex: 1 }}
                onPress={() => { setOptionsVisible(true); setId(id === undefined ? -1 : id) }}>
                <Image style={{ width: "100%", height: "100%", tintColor: "black" }} source={Icons.cogwheel} />
            </TouchableOpacity>
            {element}
        </View >
    }, [setOptionsVisible])

    const EmptySmallWidget = ({ x, y }: { x: number, y: number }) => {
        return <View style={[styles.litleBlock, { alignItems: "center", justifyContent: "center" }]}>
            <Image style={{ aspectRatio: 1, width: "50%", tintColor: "black", borderWidth: 1, borderColor: "black", borderRadius: 99999 }} source={Icons.plus} onPress={() => {
                setAddVisible(true);
                setPos({ x, y })
                setAddType("small");
            }} />
        </View>
    }

    const EmptyMediumWidget = useCallback(() => {
        return <View style={[styles.oneBlock, { alignItems: "center", justifyContent: "center", marginTop: 20, }]} >
            <Image style={{ aspectRatio: 1, width: "25%", tintColor: "black" }} source={Icons.plus} onPress={
                () => {
                    setAddVisible(true)
                    setPos({ x: 0, y: 99999 })
                    setAddType(undefined)
                }} />
        </View>
    }, [])

    const EmptyBigWidget = useCallback(() => {
        return <View style={[styles.oneBigBlock, { alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "red", }]}>
            <Image style={{ aspectRatio: 1, width: "25%", tintColor: "black", borderWidth: 1, borderColor: "black", borderRadius: 99999 }} source={Icons.plus} onPress={() => setWidgets(allWidgets)} />
        </View>
    }, [])

    const renderItem = useCallback(
        ({ item, index }: { item: WidgetItem, index: number }): JSX.Element => {
            if (item.size == "medium") {
                return onLongPressWrapper(renderMedium(item.data[0]), item.data[0]?.id)
            }
            if (item.size == "small" && item.data !== null) {
                return <View style={{ flexDirection: "row", width: "100%", }}>
                    {renderSmall(item.data[0], 0, index)}
                    <View style={{ width: margin }} />
                    {/* @ts-ignore */}
                    {renderSmall(item.data[1], 1, index)}
                </View>
            }
            if (item.size == "large") {
                return onLongPressWrapper(renderBig(item.data[0]), item.data[0]?.id)
            }
            return <></>
        }, [EmptySmallWidget])


    function Delete(id: number) {
        setWidgets(wids => {
            if (wids === undefined) {
                return undefined
            }
            var rowIndex = 0
            var columnIndex = 0
            var size = "not found"
            for (var i = 0; i < wids.length; i++) {
                if (wids[i].data[0]?.id === id) {
                    rowIndex = i
                    columnIndex = 0
                    size = wids[i].size
                    break;
                }
                if (wids[i].data[1]?.id === id) {
                    rowIndex = i
                    columnIndex = 1
                    size = wids[i].size
                    break;

                }
                rowIndex += 1
            }
            if (size == "not found") {
                return wids
            }
            if (size != "small") {
                wids.splice(rowIndex, 1)
                SaveData(wids)
                setOptionsVisible(false)
                return wids
            } else {
                if (wids[rowIndex].data[columnIndex === 1 ? 0 : 1] === null) {
                    wids.splice(rowIndex, 1)
                    SaveData(wids)
                    setOptionsVisible(false)
                    return wids
                } else {
                    wids[rowIndex].data[columnIndex] = null
                    SaveData(wids)
                    setOptionsVisible(false)
                    return wids
                }
            }
        })
    }

    function AddData(name: string, size: WidgetSize) {
        setWidgets(wids => {
            const newId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
            const newItem: IdElement = { id: newId, name }
            var newLine: WidgetItem = { size, data: [newItem] }
            if (size === "small") {
                newLine.data = [newLine.data[0], null]
            }

            if (wids === undefined || wids.length === 0) {
                wids = [newLine]
            } else if (wids.length <= pos.y) {
                wids.push(newLine)
            } else if (size != "small") {
                wids[pos.y] = newLine
            } else {
                wids[pos.y].data[pos.x] = newItem
            }
            SaveData(wids)
            setAddVisible(false)
            return wids
        })
    }

    return (
        <>
            <Modal visible={optionsVisible} onRequestClose={() => setOptionsVisible(false)} style={{ flex: 1 }} transparent animationType="slide">
                <TouchableWithoutFeedback style={styles.absolute} onPress={() => setOptionsVisible(false)}><View style={styles.absolute} /></TouchableWithoutFeedback>
                <View style={{ paddingBottom: 40, paddingTop: 20, position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "#00000055", flexDirection: "row", justifyContent: "space-around", alignSelf: "flex-end" }}>
                    <Image style={{ width: 50, height: 50 }} source={Icons.trashcan} onPress={() => Delete(id)} />
                    <Image style={{ width: 50, height: 50 }} source={Icons.lock} />
                </View>
            </Modal>
            <Modal visible={addVisible} onRequestClose={() => {
                if (addType === undefined) {
                    setAddVisible(false)
                } else {
                    setAddType(undefined)
                }
            }} style={{ flex: 1 }} transparent animationType="slide">
                <TouchableWithoutFeedback style={styles.absolute} onPress={() => setAddVisible(false)}><View style={styles.absolute} /></TouchableWithoutFeedback>
                <FlatList<WidgetSize | { name: string, size: string }>
                    data={addType === undefined ? ["small", "medium", "large"] : Object.values(widgetTable).filter(em => em.size === addType)}
                    renderItem={data => {
                        function onPress() {
                            if (typeof data.item !== "string") {
                                //@ts-ignore
                                AddData(data.item.name, addType)
                            } else {
                                setAddType(data.item)
                            }
                        }
                        return <TouchableOpacity style={{ width: "100%", backgroundColor: "#000000CC", paddingHorizontal: 10, paddingVertical: 13 }} onPress={onPress}>
                                {/* @ts-ignore */}
                            <Text style={{ color: "white", "fontFamily": "ArchivoNarrow-Regular", fontSize: 16 }}>{data.item.name || data.item}</Text>
                        </TouchableOpacity>
                    }}
                    style={{ paddingBottom: 33, position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "#00000055", alignSelf: "flex-end" }}

                />
            </Modal>
            <FlatList
                data={widgets}
                renderItem={renderItem}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{ paddingHorizontal: 20, }}
                contentContainerStyle={{ paddingVertical: 20, }}
                ItemSeparatorComponent={Separator}
                refreshing={widgets === undefined}
                ListFooterComponent={() => {
                    return <EmptyMediumWidget />
                }}
            />
        </>
    )
}

const margin = 20
const ySizeBlock = 160

const blockStyles = StyleSheet.create({
    block: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 25,
        height: ySizeBlock,
        overflow: "hidden",
    },
})

const styles = StyleSheet.create({
    oneBlock: {
        ...blockStyles.block,
    },
    litleBlock: {
        ...blockStyles.block,
        flex: 1,
    },
    twoBlock: {
        ...blockStyles.block,
        backgroundColor: undefined,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    oneBigBlock: {
        ...blockStyles.block,
        height: (ySizeBlock * 2) - margin,
    },
    absolute: {
        position: "absolute",
        top: 0, bottom: 0, left: 0, right: 0,
    }
})

const widgetTable = {
    Weather: { name: "Weather", size: "small", element: <WeatherWidget /> },
    WeatherMedium: { name: "WeatherMedium", size: "medium", element: <WeatherWidget /> },
    Tomato: { name: "Tomato", size: "medium", element: <Tomate /> },
    Todos: { name: "Todos", size: "large", element: <Todos /> },
    Notes: { name: "Notes", size: "large", element: <Notes /> },
    Market: { name: "Market", size: "medium", element: <StockMarket /> },
}

type WidgetSize = "small" | "medium" | "large"

type IdElement = { id: number, name: String }

type WidgetItem = {
    size: WidgetSize
    data: [IdElement, IdElement] | [null, IdElement] | [IdElement, null] | [null, null] | [IdElement] | [null]
}
const allWidgets: WidgetItem[] = [
    { size: "medium", data: [{ id: 0, name: "Market" }] },
    { size: "small", data: [{ id: 6, name: "Weather" }, { id: 1, name: "Weather" }] },
    { size: "medium", data: [{ id: 2, name: "Tomato" }] },
    { size: "small", data: [{ id: 3, name: "Weather" }, null] },
    { size: "large", data: [{ id: 4, name: "Todos" }] },
    { size: "large", data: [{ id: 5, name: "Notes" }] },
]

