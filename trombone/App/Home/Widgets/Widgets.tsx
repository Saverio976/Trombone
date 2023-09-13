import WeatherWidget from "@app/App/Weather"
import Colors from "@app/Colors"
import { StyleSheet, View, Text, FlatList } from "react-native"
import Tomate from "../Tomate"
import Notes from "../Note"

function renderItem({ item }: { item: WidgetItem }): JSX.Element {
    if (item.size == "medium") {
        return <View style={styles.oneBlock}>
            {item.elements[0]}
        </View>
    }
    if (item.size == "small") {
        return <View style={{ flexDirection: "row", width: "100%", }}>
            <View style={styles.litleBlock}>
                {item.elements[0]}
            </View>
            <View style={{ width: margin }} />
            <View style={styles.litleBlock}>
                {item.elements.length == 2 ? item.elements[1] : <></>}
            </View>
        </View>
    }
    if (item.size == "large") {
        return <View style={styles.oneBigBlock}>
            {item.elements[0]}
        </View>
    }
    return <></>
}

function Separator() {
    return <View style={{ height: margin }} />
}

export const Widgets = (): JSX.Element => {
    return (
        <FlatList
            data={allWidgets}
            renderItem={renderItem}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 20, paddingVertical: 10, }}
            ItemSeparatorComponent={Separator}
        />
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
})

const widgetTable: { [name: string]: { size: WidgetSize, element: () => JSX.Element } } = {
    "Weather": {size: "small", element: WeatherWidget},
    "Tomato": {size: "medium", element: Tomate},
    "Todos": {size: "large", element: Notes}
}

// const widgetConfig =

type WidgetSize = "small" | "medium" | "large"

type WidgetItem = {
    size: WidgetSize,
    elements: [JSX.Element] | [JSX.Element, JSX.Element],
}

const allWidgets: WidgetItem[] = [
    { size: "large", elements: [<Text>First block</Text>] },
    { size: "small", elements: [<Text>Second block</Text>, <WeatherWidget />] },
    { size: "medium", elements: [<Text>Fourth block</Text>] },
    { size: "small", elements: [<WeatherWidget />] },
    { size: "medium", elements: [<Text>Fifth block</Text>] },
]

