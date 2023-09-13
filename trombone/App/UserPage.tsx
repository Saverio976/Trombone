import { UserInfoScreenParams } from "@app/App";
import Fonts from "@app/Fonts";
import Icons from "@app/Icons";
import { BlurView } from "@react-native-community/blur";
import React from "react";
import { Button, Image, Text, View, Linking, TouchableOpacity, StyleSheet, Modal, Touchable, TouchableWithoutFeedback } from "react-native";


function UserInfoScreen({ navigation, route }: UserInfoScreenParams): JSX.Element {
    const { employee, img, me, meImg } = route.params

    function OpenEmail() {
        Linking.canOpenURL("mailto:" + employee.email).then(() => {
            Linking.openURL("mailto:" + employee.email).then(() => {
            }).catch(err => console.error(err))
        }).catch(err => console.error(err))
    }

    function goBack() {
        navigation.goBack()
    }

    function goToChat() {
        navigation.goBack()
        navigation.navigate("Chat", {
            partner: { id: employee.id, fullname: `${employee.name} ${employee.surname}` },
            employee: me,
            img: meImg,
        })
    }

    return (
        <Modal visible={true} transparent={true} animationType="slide" onRequestClose={goBack}>
            <View style={styles.wrapper}>
                {/* <BlurView style={styles.absolute} blurType="light" blurAmount={5} blurRadius={1} /> */}
                <TouchableOpacity style={styles.absolute} onPress={goBack} />
                <View style={styles.innerContainer}>
                    <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={goBack}>
                        <Image source={Icons.lock} />
                    </TouchableOpacity>
                    <Image style={styles.profilePicture} source={{ uri: img }} />
                    <Text numberOfLines={3} style={styles.names}>{employee.name} {employee.surname}</Text>
                    <Text onPress={OpenEmail} style={styles.emailText}>{employee.email}</Text>
                    <Text style={{ fontSize: 30 }}>{employee.birth_date}</Text>
                    <Text style={{ fontSize: 30 }}>{employee.work}</Text>
                    {me.id != employee.id ? <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={goToChat}>
                        <Image source={Icons.lock} />
                    </TouchableOpacity>
                        : null
                    }
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    wrapper: {
        flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10
    },
    names: {
        ...Fonts.text,
        fontSize: 32,
    },
    emailText: {
        ...Fonts.text,
    },
    innerContainer: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: "100%",
    },
    profilePicture: {
        width: "100%",
        borderRadius: 20,
        aspectRatio: 1,
    }
})

export default UserInfoScreen
