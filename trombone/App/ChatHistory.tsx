import { useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Modal } from 'react-native';
import { ChatHistoryParams } from '@app/App';
import { BlurView } from '@react-native-community/blur';

function Separator() {
    return <View style={{ height: 1, backgroundColor: "#333333" }} />
}

function Footer() {
    return <Text style={{ textAlign: "center", marginHorizontal: 20, color: "white", marginTop: 29, marginBottom: 30, }}>Recherchez dans le trombinoscope pour commencer un nouveau chat!</Text>
}

export default function ChatHistory({ navigation, route }: ChatHistoryParams): JSX.Element {

    const renderItem = useCallback(({ item }: { item: { id: number, fullname: string } }) => {
        function onTapName() {
            navigation.goBack();
            const n1 = { employee: route.params.me, img: route.params.image, partner: item }
            navigation.navigate("Chat", n1)
        }

        return <TouchableOpacity style={{ width: "100%", backgroundColor: "#000000CC", paddingHorizontal: 10, paddingVertical: 13 }} onPress={onTapName}>
            <Text style={{ color: "white", "fontFamily": "ArchivoNarrow-Regular", fontSize: 16 }}>{item.fullname}</Text>
        </TouchableOpacity>
    }, [])

    function goBack() {
        navigation.goBack()
    }
    return <Modal visible={true} transparent={true} animationType="slide" onRequestClose={goBack} onDismiss={goBack} >
        <TouchableWithoutFeedback style={styles.absolute} onPress={goBack}><View style={styles.absolute} /></TouchableWithoutFeedback>
        <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurRadius={3} overlayColor="transparent" />
            <View style={styles.innerContainer}>
                <FlatList
                    data={route.params.data}
                    renderItem={renderItem}
                    ItemSeparatorComponent={Separator}
                    style={{ width: "100%" }}
                    contentContainerStyle={{}}
                    ListFooterComponent={Footer}
                />
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    innerContainer: {
        backgroundColor: "#2D2D2D66",
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: "100%",
        height: "100%",
    },
    wrapper: {
        position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: "purple",
        height: "80%",
    },
    absolute: {
        position: "absolute",
        top: 0, bottom: 0, left: 0, right: 0
    },
});
