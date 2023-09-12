import { store } from '@app/App/Reducer';
import Fonts from '@app/Fonts';
import Icons from '@app/Icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { apiImage, apiMe, EmployeeFull } from '@app/Api';

export function Header() {
    const { value } = store.getState()
    const [image, setImage] = useState<string | ArrayBuffer>("")
    const [me, setMe] = useState<EmployeeFull | undefined>()
    const nav: any = useNavigation()

    function adminMock() {
        setMe({ name: "admin", surname: "account", id: -1, email: "admin@admin.com", birth_date: "today", gender: "None", work: "Admin", subordinates: [] })
        setImage("https://thispersondoesnotexist.com/")
    }

    function getImage(id: number) {
        apiImage(id, value).then(response => {
            if (response.code !== 200 || response.blob === undefined) {
                return
            }
            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(response.blob);
            fileReaderInstance.onload = () => {
                var base64data = fileReaderInstance.result;
                setImage("data:image/png;" + base64data)
            }
        })
    }

    function displayFullName(): string {
        if (me === undefined) {
            return "";
        } else {
            return me.name + " " + me.surname
        }
    }

    useEffect(() => {
        if (value === true) {
            adminMock();
            return;
        }
        apiMe(value).then(response => {
            if (response.code !== 200 || response.json === undefined) {
                console.error(response)
                return
            }
            setMe(response.json)
            getImage(response.json.id)
        })
    }, [])
    function onOptions() {
        // store.dispatch({ type: "logout" });
        // navigation.reset("Login")
        nav.navigate("Chat", {employee: me, img: image, partner: {id: 1, fullname: "Hello world!"}});
    }
    function onPressMyImage() {
        nav.navigate("UserInfo", { employee: me, img: image})
    }

    function meImage() {
        return <TouchableOpacity onPress={onPressMyImage}>
            <Image style={styles.image} source={{ uri: String(image) }} />
        </TouchableOpacity>
    }

    return (
        <View style={styles.container}>
            {image === "" ? <ActivityIndicator style={styles.image} /> : meImage() }
            <Text style={styles.name}>{displayFullName()}</Text>
            <TouchableOpacity onPress={onOptions}>
                <Image style={styles.cogwheel} source={Icons.cogwheel} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    cogwheel: {
        width: 50,
        resizeMode: "contain"
    },
    name: {
        ...Fonts.H3,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
    }
})
