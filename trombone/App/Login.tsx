import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Colors from "@app/Colors";
import Fonts from "@app/Fonts";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '@app/Components/Button';
import Icons, { Images } from '@app/Icons';
import { store } from './Reducer';
import { apiLogin } from '@app/Api';

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

        apiLogin(email, password).then(response => {
            if (response.code !== 200 || response.json === undefined) {
                console.error(response)
                return
            }
            store.dispatch({type: 'login', token: response.json.access_token})
            navigation.reset({index: 0, routes: [{name: "Home"}]});
        }).finally(() => { setApiCall(false) });
    }


    return (<LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[Colors.gradient1, Colors.gradient2, Colors.gradient3]}
        locations={[0, 0.1, 1]}
        style={styles.background}
    >
            <Image source={Images.logoCircle} style={styles.logo} />
            <ActivityIndicator animating={apiCall}/>
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
                <Button style={styles.loginButton} onPress={onTryLogin} disabled={email === "" || password === "" || apiCall }>
                    <Text style={styles.loginButtonText}>
                        Se connecter
                    </Text>
                </Button>
                <Button style={styles.loginButton} onPress={QuickAdmin}>
                    <Text style={styles.loginButtonText}>
                        Admin
                    </Text>
                </Button>
            </View>
    </LinearGradient>)
}



const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    logo: {
        width: 118,
        height: 118,
        marginTop: 35,
        marginBottom: 20,
    },
    background: {
        paddingHorizontal: 10,
        alignItems: "center",
        flex: 1,
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
        backgroundColor: "#fff",
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
        backgroundColor: "#565656",
        alignSelf: "flex-end",
        borderRadius: 10,
    },
    loginButtonText: {
        ...Fonts.text,
        color: "#fff",
        marginVertical: 19,
        marginHorizontal: 22,
    },
    inputBoxTitle: {
        ...Fonts.text,
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
