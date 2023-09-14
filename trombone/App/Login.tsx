import React, { useEffect, useState } from 'react';
import Colors from "@app/Colors";
import Fonts from "@app/Fonts";
import { ActivityIndicator, Image, ImageBackground, Keyboard, KeyboardAvoidingView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Button from '@app/Components/Button';
import { Images } from '@app/Icons';
import { store } from './Reducer';
import { apiLogin, apiMe } from '@app/Api';
import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message';
import { Modal, TextInput } from 'react-native-paper';
import { auth } from '@app/firebase';
import { signInAnonymously } from 'firebase/auth';
import { getLastToken, setLastToken } from '@app/PersistentLogin';


interface inputBoxProps {
    hidden?: boolean;
    setFunc: (value: string) => void;
    str: string;
    placeholder: string;
}


function InputBox({ hidden = false, setFunc, str, placeholder }: inputBoxProps): JSX.Element {
    return <View style={styles.textWrapper}>
        <TextInput
            onChangeText={setFunc}
            style={styles.inputBoxInput}
            value={str} placeholder={placeholder}
            underlineStyle={{ height: 0, }}
            placeholderTextColor={"#2d2d2d66"}
            secureTextEntry={hidden}
        />
    </View>

}


function LoginPage({ navigation }: { navigation: any }): JSX.Element {
    const [email, setEmail] = useState<string>("oliver.lewis@masurao.jp");
    const [password, setPassword] = useState<string>("password");
    const [apiCall, setApiCall] = useState<boolean>(false);
    const user = store.getState();

    const LoginWithToken = async (token: string) => {
        store.dispatch({ type: 'login', token: token })
        await setLastToken(token)
        Toast.show({ text1: "Connexion réussie" })
        signInAnonymously(auth)
        await navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }

    useEffect(() => {
        setApiCall(true)

        getLastToken().then((token) => {
            if (token === null) {
                setApiCall(false)
                return
            }
            apiMe(token).then((res) => {
                if (res.code !== 200) {
                    setApiCall(false)
                    return
                }
                LoginWithToken(token).then(() => { console.log("Logged in using last token"); setApiCall(false) })
            })
        });
    }, [])


    function QuickAdmin() {
        console.log("Admin Login");
        store.dispatch({ type: 'adminLogin' })
        signInAnonymously(auth)
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }

    const onTryLogin = async () => {
        setApiCall(true);

        if (email === "admin" && password === "admin") {
            QuickAdmin();
            return;
        }

        apiLogin(email, password).then(async response => {
            if (response.code === 401) {
                Toast.show({
                    type: "error",
                    text1: "Connexion échoué",
                    text2: "Email ou mot de passe invalide",
                })
                return
            } else if (response.code !== 200 || response.json === undefined) {
                console.error(response)
                Toast.show({
                    type: "error",
                    text1: "Connexion échoué",
                    text2: "Erreur fatale du server, connexion impossible",
                })
                return
            }
            await LoginWithToken(response.json.access_token)
            console.log("Logged in using password")
        }).finally(() => { setApiCall(false) });
    }

    return (<KeyboardAvoidingView style={styles.background} behavior="height" enabled={false}>
        <ImageBackground source={Images.login_bg} resizeMode="stretch" style={styles.imageBg}>
            <View style={styles.flex1}>
                <Image style={styles.logo} source={Images.logo} />
            </View>
            <View style={styles.flex2}>
                <View style={{ flex: 70 }} />
                <View style={{ flex: 100 }}>
                    <InputBox
                        setFunc={setEmail}
                        str={email}
                        placeholder="Email" />
                    <View style={styles.spacing} />
                    <InputBox
                        setFunc={setPassword}
                        str={password}
                        hidden
                        placeholder='Mot de passe' />
                </View>
            </View>
            <View style={styles.flex3}>
                <Button style={styles.loginButton} onPress={onTryLogin} disabled={email === "" || password === "" || apiCall}>
                    <Text style={styles.loginButtonText}>
                        Login
                    </Text>
                </Button>
                <Button style={styles.loginButton} onPress={QuickAdmin}>
                    <Text style={styles.loginButtonText}>
                        Admin
                    </Text>
                </Button>
            </View>
        </ImageBackground>
        <Modal visible={apiCall} dismissable={false} theme={{
            colors: {backdrop: "#00000050"},
        }}>
            <ActivityIndicator style={{alignSelf: "center"}} animating={true} size={100} color="#1873A6"/>
        </Modal>
    </KeyboardAvoidingView>)
}



const styles = StyleSheet.create({
    flex1: { flex: 1, justifyContent: "center" },
    flex2: { flex: 2, justifyContent: "center" },
    flex3: { flex: 1, justifyContent: "flex-end", },
    imageBg: {height: "100%",},
    wrapper: {width: '100%',},
    fakeButton: {
        height: 2,
        marginVertical: -0.5,
        marginHorizontal: 20
    },
    logo: {
        alignSelf: "center",
        width: "80%",
        height: undefined,
        aspectRatio: 290 / 98
    },
    background: {
        height: "100%",
    },
    spacing: {
        height: 20,
    },
    loginButton: {
        marginBottom: 23,
        backgroundColor: Colors.secondary,
        alignSelf: "center",
        borderRadius: 5000,
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    loginButtonText: {
        ...Fonts.text,
        color: Colors.text,
        marginHorizontal: 22,
        fontSize: 32,
        marginVertical: 5,
    },
    inputBoxInput: {
        ...Fonts.text,
        padding: 0,
        margin: 0,
        fontSize: 20,
        textAlign: "center",
        color: "black",
        paddingBottom: 0,
        paddingTop: 0,
        backgroundColor: "transparent",
    },
    textWrapper: {
        justifyContent: "center",
        width: "80%",
        backgroundColor: Colors.secondary,
        borderRadius: 50,
        alignSelf: "center",
    }
})

export default LoginPage;
