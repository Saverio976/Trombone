import { store } from '@app/App/Reducer';
import Fonts from '@app/Fonts';
import Icons from '@app/Icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiImage, apiMe, EmployeeFull } from '@app/Api';
import Toast from "react-native-toast-message";
import { collection, onSnapshot, or, orderBy, query, where } from 'firebase/firestore';
import { db } from '@app/firebase';

type smallDbItem = { userId: number, partnerId: number, partnerName: string, userName: string }

export function Header() {
    const { value } = store.getState()
    const [image, setImage] = useState<string | ArrayBuffer>("")
    const [me, setMe] = useState<EmployeeFull | undefined>()
    const nav: any = useNavigation()
    const [messages, setMessages] = useState<smallDbItem[]>([])
    const [convPartners, setConvPartners] = useState<{ id: number, fullname: string }[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    function adminMock() {
        setMe({ name: "admin", surname: "account", id: -1, email: "admin@admin.com", birth_date: "today", gender: "None", work: "Admin", subordinates: [] })
        setImage("https://thispersondoesnotexist.com/")
    }

    function getImage(id: number) {
        apiImage(id, value).then(response => {
            if (response.code !== 200 || response.blob === undefined) {
                Toast.show({
                    type: "error",
                    text1: "Erreur fatale",
                    text2: "Impossible de récupérer l'image de l'utilisateur",
                })
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
        setLoading(true)
        apiMe(value).then(response => {
            if (response.code !== 200 || response.json === undefined) {
                Toast.show({
                    type: "error",
                    text1: "Erreur fatale",
                    text2: "Impossible de récupérer les données de l'utilisateur",
                })
                console.error(response)
                return
            }
            setMe(response.json)
            getImage(response.json.id)
        })
    }, [])

    useEffect(() => {
        if (me === undefined || me.id === undefined) {
            return
        }
        const q = query(collection(db, 'chats'),
            or(
                where("user._id", "==", me.id),
                where("partnerId", "==", me.id)
            ),
            orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                createdAt: doc.data().createdAt.toDate(),
                userId: doc.data().user._id,
                userName: doc.data().user.name,
                partnerId: doc.data().partnerId,
                partnerName: doc.data().partnerName,

            }))
        ));
        return () => {
            unsubscribe();
        };
    }, [me])

    useEffect(() => {
        var result: { id: number, fullname: string }[] = [];

        messages.forEach(element => {
            const otherId = element.userId == me?.id ? element.partnerId : element.userId
            const otherName = element.userId == me?.id ? element.partnerName : element.userName

            if (result.findIndex(em => em.id === otherId) === -1) {
                result.push({ id: otherId, fullname: otherName })
            }
        });
        if (result.length > 0) {
            setLoading(false);
        }
        setConvPartners(result)
    }, [messages])

    function onOptions() {

        const n1 = { employee: me, img: image, partner: { id: 4, fullname: "David Johnson" } }
        nav.navigate("Chat", n1);
    }
    function onOptions2() {
        nav.navigate("ChatHistory", {
            data: convPartners,
            me: me,
            image: image
        })
        // store.dispatch({ type: "logout" });
        // nav.reset("Login")
        // const n2 = {
        //     employee: {
        //         id: 4,
        //         name: "David",
        //     }, img: require("@app/assets/David.png"), partner: { id: 74, fullname: "Oliver Lewis" }
        // }
        // nav.navigate("Chat", n2);
    }
    function onPressMyImage() {
        nav.navigate("UserInfo", { employee: me, img: image, meImage: image, me })
    }

    function meImage() {
        return <TouchableOpacity onPress={onPressMyImage}>
            <Image style={styles.image} source={{ uri: String(image) }} />
        </TouchableOpacity>
    }

    return (
        <View style={styles.container}>
            {image === "" ? <ActivityIndicator style={styles.image} /> : meImage()}
            <Text style={styles.name}>{displayFullName()}</Text>
            {/* <TouchableOpacity onPress={onOptions}>
                <Image style={styles.cogwheel} source={Icons.cogwheel} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onOptions2} disabled={loading}>
                <Image style={[styles.cogwheel, { tintColor: "black" }]} source={Icons.cogwheel} />
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
