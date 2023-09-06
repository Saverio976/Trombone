import { store } from '@app/App/Reducer';
import Fonts from '@app/Fonts';
import Icons from '@app/Icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiImage, apiMe } from '@app/Api';

export function Header() {
    const {value} = store.getState()
    const [fullName, setFullName] = useState<string>("")
    const [image, setImage] = useState<string | ArrayBuffer>("")
    const nav: any = useNavigation()

    function adminMock() {
        setFullName("Admin account")
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
            setFullName(response.json.name + " " + response.json.surname)
            getImage(response.json.id)
        })
    }, [])
    function onOptions () {
        store.dispatch({type: "logout"});
        // navigation.reset("Login")
        nav.navigate("Login");
    }

    return (
        <View style={styles.container}>
            {image === "" ? <ActivityIndicator style={styles.image} /> : <Image style={styles.image} source={{uri: String(image)}}/>}
            <Text style={styles.name}>{fullName}</Text>
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
