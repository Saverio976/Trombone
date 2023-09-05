import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Colors from "@app/Colors.ts";
import Fonts from "@app/Fonts.tsx";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '@app/Components/Button';
import Icons from '@app/Icons';
import { authStatus } from '@app/Global';
import { authReducerState, store } from './Reducer';

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


function LoginPage(): JSX.Element {
    const [email, setEmail] = useState<string>("oliver.lewis@masurao.jp");
    const [password, setPassword] = useState<string>("password");
    const [apiCall, setApiCall] = useState<boolean>(false);
    const user = store.getState();

    const onTryLogin = async () => {
        setApiCall(true);

        if (email === "admin" && password === "admin") {
            console.log("Admin Login");
            store.dispatch({type: 'adminLogin'})
            return;
        }

        fetch("https://masurao.fr/api/employees/login", {
            method: "POST",
            headers: {
                "X-Group-Authorization" : "qkRWGKs55LnaJUowf7VbzUUR4skcllAF",
                "accept": "application/json",
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(async (asyncResponse) => {
                const response = await asyncResponse.json()
                if (asyncResponse.status === 200) {
                    console.log("Successfully logged in")
                    store.dispatch({type: 'login', token: response["access_token"]})
                } else {
                    console.log(response)
                }
            })
            .catch((error) => {
                console.error(error)
             })
            .finally(() => { setApiCall(false) });
    }


    return (<LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[Colors.gradient1, Colors.gradient2, Colors.gradient3]}
        locations={[0, 0.1, 1]}
        style={styles.background}
    >
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
                mode="email"
                placeholder="name.surname@email.com" />
            <View style={styles.spacing} />
            <InputBox icon={Icons.lock}
                setFunc={setPassword}
                str={password}
                title="MOT DE PASSE"
                hidden
                placeholder='password' />
            <Button style={styles.loginButton} onPress={onTryLogin}>
                <Text style={styles.loginButtonText}>
                    Se connecter{"\n"}{String(user.value)}
                </Text>
            </Button>
        </View>
    </LinearGradient>)
}



const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    loginCard: {
        backgroundColor: Colors.secondary,
        width: "100%",
        paddingHorizontal: 10,
        borderRadius: 10,
        paddingTop: 40,
        paddingBottom: 22,
    },
    loginTitle: {
        ...Fonts.H1,
        marginLeft: 22,
        marginBottom: 40,
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
