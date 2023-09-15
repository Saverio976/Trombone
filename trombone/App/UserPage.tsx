import { UserInfoScreenParams } from "@app/App";
import Fonts from "@app/Fonts";
import Icons from "@app/Icons";
import { clearToken } from "@app/PersistentLogin";
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

    function formatDate() {
        var x = new Date(employee.birth_date)
        return `${x.getDate()}/${x.getMonth()}/${x.getFullYear()}`
    }

    async function Logout() {
        console.log("Sex")
        await clearToken();
        navigation.reset({routes: [{"name": "Login"}], index: 0})
    }

    const isSelf = me.id == employee.id;
    return (
        <Modal visible={true} transparent={true} animationType="slide" onRequestClose={goBack} onDismiss={goBack} >
            <TouchableWithoutFeedback style={styles.absolute} onPress={goBack}><View style={styles.absolute}/></TouchableWithoutFeedback>
            <View style={styles.wrapper}>
                <BlurView style={styles.absolute} blurRadius={3} overlayColor="transparent" />
                <View style={styles.innerContainer}>
                    {/* <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={goBack}>
                        <Image source={Icons.lock} />
                    </TouchableOpacity> */}
                    <Image style={styles.profilePicture} source={{ uri: img }} />
                    <Text numberOfLines={3} style={styles.names}>{employee.name} {employee.surname}</Text>
                    <Text style={styles.birthDate}>{formatDate()}</Text>
                    <Text onPress={OpenEmail} style={styles.emailText}>{employee.email}</Text>
                    <Text style={styles.job}>{employee.work}</Text>
                    {<TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={isSelf ? Logout : goToChat}>
                    <Image source={isSelf ?Icons.arrow : Icons.chat} style={{ width: 32, height: 32, marginBottom: 16, marginTop: 20, }} />
                    </TouchableOpacity>
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
        bottom: 0,
        left: 0,
        right: 0,
    },
    wrapper: {
        alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: "flex-end", position: "absolute", bottom: 0, left: 0, width: "100%",
    },
    job: {
        fontFamily: "ArchivoNarrow-Bold",
        color: "white",
        fontSize: 36
    },
    names: {
        ...Fonts.text,
        color: "white",
        fontFamily: "ArchivoNarrow-Bold",
        fontSize: 32,
        marginBottom: 18,

    },
    emailText: {
        ...Fonts.text,
        color: "white",
        fontFamily: "ArchivoNarrow-Bold",
        fontSize: 24,
        marginBottom: 5,
        marginTop: -10,
    },
    birthDate: {
        fontFamily: "ArchivoNarrow-Bold",
        color: "white",
        fontSize: 36,
    },
    innerContainer: {
        backgroundColor: "#2D2D2D66",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: "100%",
    },
    profilePicture: {
        width: "80%",
        borderRadius: 20,
        aspectRatio: 0.83,
    }
})

export default UserInfoScreen
