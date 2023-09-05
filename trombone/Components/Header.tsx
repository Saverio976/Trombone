import { store } from '@app/App/Reducer';
import Fonts from '@app/Fonts';
import Icons from '@app/Icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

function myFetch(endpoint: string, token: boolean | string | undefined, body?: string, method: string = "GET") {
    console.log("Authorization: " + "Bearer " + token)
    console.log("https://masurao.fr/" + endpoint)
    return fetch("https://masurao.fr/" + endpoint, {
        method,
        headers: {
            "X-Group-Authorization" : "qkRWGKs55LnaJUowf7VbzUUR4skcllAF",
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body
    })
}

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
        myFetch("api/employees/" + id + "/image", value)
            .then(async (asyncResponse) => {
                const response = await asyncResponse.blob()
                if (asyncResponse.status === 200) {
                    console.log(response)
                    const fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(response);
                    fileReaderInstance.onload = () => {
                        var base64data = fileReaderInstance.result;
                        setImage("data:image/png;" + base64data)
                    }
                } else {
                    console.error(response)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        if (value === true) {
            adminMock();
            return;
        }
        myFetch("api/employees/me", value)
            .then(async (asyncResponse) => {
                const response = await asyncResponse.json()
                if (asyncResponse.status === 200) {
                    setFullName(response["name"] + " " + response["surname"])
                    getImage(response["id"])
                } else {
                    console.error(response)
                }
            })
            .catch((error) => {
                console.error(error)
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
