import Colors from "@app/Colors"
import { StyleSheet, View, Text, FlatList } from "react-native"

export const Widgets = (): JSX.Element => {
    return (
        <FlatList
            data={allWidgets}
            renderItem={({ item }) => item}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{paddingHorizontal: 20}}
        />
    )
}

const margin = 20
const ySizeBlock = 160

const blockStyles = StyleSheet.create({
    blockBlock: {
        marginTop: margin,
    },
    block: {
        backgroundColor: Colors.secondary,
        borderRadius: 25,
        height: ySizeBlock,
    },
})

const styles = StyleSheet.create({
    oneBlock: {
        ...blockStyles.block,
        ...blockStyles.blockBlock,
    },
    litleBlock: {
        ...blockStyles.block,
        flex: 1,
    },
    twoBlock: {
        ...blockStyles.block,
        ...blockStyles.blockBlock,
        backgroundColor: undefined,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    oneBigBlock: {
        ...blockStyles.block,
        ...blockStyles.blockBlock,
        height: (ySizeBlock * 2) - margin,
    },
})

const allWidgets: JSX.Element[] = [
    <View style={styles.oneBlock}>
        <Text>First block</Text>
    </View>,

    <View style={styles.twoBlock}>
        <View style={styles.litleBlock}>
            <Text>Second block</Text>
        </View>
        <View style={{margin: margin / 2}} />
        <View style={styles.litleBlock}>
            <Text>Third block</Text>
        </View>
    </View>,

    <View style={styles.oneBigBlock}>
        <Text>Fourth block</Text>
    </View>,

    <View style={styles.oneBlock}>
        <Text>Fifth block</Text>
    </View>,
]
