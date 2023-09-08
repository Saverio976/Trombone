import React, { useState } from 'react';
import Colors from "@app/Colors";
import Fonts from "@app/Fonts";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '@app/Components/Button';
import Icons, { Images } from '@app/Icons';
import { store } from './Reducer';
import { apiLogin } from '@app/Api';
import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message';

interface inputBoxProps {
    icon: any;
    hidden?: boolean;
    setFunc: (value: string) => void;
    title: string;
    str: string;
    placeholder: string;
}

function InputBox({ icon, hidden = false, setFunc, title, str, placeholder }: inputBoxProps): JSX.Element {
    return <View style={styles.inputBox}>
        <Image source={icon} style={styles.inputBoxIcon} />
        <View style={styles.innerInputBox}>
            <Text style={styles.inputBoxTitle}>{title}</Text>
            <TextInput onChangeText={setFunc} secureTextEntry={hidden} style={styles.inputBoxInput} value={str} placeholder={placeholder}
                placeholderTextColor="#CCC"></TextInput>
        </View>
    </View>
}


function LoginPage({ navigation }: { navigation: any }): JSX.Element {
    const [email, setEmail] = useState<string>("oliver.lewis@masurao.jp");
    const [password, setPassword] = useState<string>("password");
    const [apiCall, setApiCall] = useState<boolean>(false);
    const user = store.getState();

    function QuickAdmin() {
        console.log("Admin Login");
        store.dispatch({ type: 'adminLogin' })
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
                Toast.show({
                    type: "error",
                    text1: "Connexion échoué",
                    text2: "Erreur fatale du server, connexion impossible",
                })
                return
            }
            store.dispatch({ type: 'login', token: response.json.access_token })
            Toast.show({text1: "Connexion réussie"})
            await navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        }).finally(() => { setApiCall(false) });
    }

    return (<View style={styles.background}>
        <Image source={Images.logoCircle} style={styles.logo} />
        <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>
                Connexion
            </Text>
            <InputBox
                icon={Icons.email}
                setFunc={setEmail}
                str={email}
                title="EMAIL"
                placeholder="name.surname@email.com" />
            <View style={styles.spacing} />
            <InputBox icon={Icons.lock}
                setFunc={setPassword}
                str={password}
                title="MOT DE PASSE"
                hidden
                placeholder='password' />
            <Button style={styles.loginButton} onPress={onTryLogin} disabled={email === "" || password === "" || apiCall}>
                {apiCall === false ? <Text style={styles.loginButtonText}>
                    Se connecter
                </Text>
                    : <>
                        <ActivityIndicator animating={true} style={styles.loginButton2} />
                        <Text style={[styles.loginButtonText, styles.fakeButton]}> Se connecter</Text>
                    </>
                }
            </Button>
            <Button style={styles.loginButton} onPress={QuickAdmin}>
                <Text style={styles.loginButtonText}>
                    Admin
                </Text>
            </Button>
        </View>
    </View>)
}



const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    fakeButton: {
        height: 2,
        marginVertical: -0.5,
        marginHorizontal: 20
    },
    logo: {
        width: 118,
        height: 118,
        marginTop: 35,
        marginBottom: 35,
    },
    background: {
        paddingHorizontal: 10,
        alignItems: "center",
        flex: 1,
        backgroundColor: Colors.primary,
    },
    loginCard: {
        backgroundColor: Colors.secondary,
        width: "100%",
        paddingHorizontal: 10,
        borderRadius: 10,
        paddingTop: 30,
        paddingBottom: 22,
    },
    loginTitle: {
        ...Fonts.H1,
        marginLeft: 22,
        marginBottom: 25,
    },
    inputBox: {
        backgroundColor: Colors.light,
        elevation: 10,
        shadowColor: "0x40000000",
        borderRadius: 2,
        flexDirection: "row",
        alignContent: "center",
    },
    spacing: {
        height: 34,
    },
    loginButton: {
        marginTop: 29,
        backgroundColor: Colors.light,
        alignSelf: "flex-end",
        borderRadius: 10,
        justifyContent: "center",
    },
    loginButton2: {
        marginVertical: 20,
        marginHorizontal: 1,
    },
    loginButtonText: {
        ...Fonts.text,
        color: Colors.text,
        marginVertical: 19,
        marginHorizontal: 22,
    },
    inputBoxTitle: {
        ...Fonts.text,
        color: Colors.text,
        marginTop: 6,
    },
    innerInputBox: {
        flex: 1,
    },
    inputBoxIcon: {
        marginLeft: 14,
        marginRight: 15,
        width: 33,
        alignSelf: "center",
        resizeMode: "contain",
    },
    inputBoxInput: {
        ...Fonts.text,
        margin: 0,
        padding: 0,
        marginRight: 10,
        marginBottom: 10,
        borderBottomColor: "#000",
        // borderBottomWidth: 1,
        color: "#000",
    }
})

export default LoginPage;
