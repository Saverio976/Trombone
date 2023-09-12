import React, { useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import { collection, addDoc, query, orderBy, onSnapshot, where, or, and } from 'firebase/firestore';
import { Bubble, GiftedChat, IMessage, Time } from 'react-native-gifted-chat';
import Icons, { Images } from '@app/Icons';
import { ChatScreenParams } from '@app/App';
import { db } from '@app/firebase';
import { BackgroundImage } from 'react-native-elements/dist/config';
import Fonts from '@app/Fonts';


const Chat = ({ navigation, route }: ChatScreenParams) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar
                        rounded
                        source={
                            Icons.email}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 10
                }}
                >
                    <Text>logout</Text>
                </TouchableOpacity>
            )
        })


        const q = query(collection(db, 'chats'),
            or(
                and(where("user._id", "==", route.params.employee.id), where("partnerId", "==", route.params.partner.id)),
                and(where("user._id", "==", route.params.partner.id), where("partnerId", "==", route.params.employee.id))
            ),
            orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ));

        return () => {
            unsubscribe();
        };

    }, [navigation]);

    const onSend = useCallback((messages: IMessage[] = []) => {
        const { _id, createdAt, text, user } = messages[0]

        addDoc(collection(db, 'chats'), { _id, createdAt, text, user, partnerId: route.params.partner.id });
    }, []);

    function Header() {
        return <View style={styles.header}>
            <View style={{ flex: 1, paddingLeft: 10 }}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Image source={Icons.chatArrow} style={styles.goBack} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.headerName}>{route.params.partner.fullname}</Text>
            </View>
            <View
                style={{ flex: 1, paddingRight: 10 }}>
            </View>
        </View>
    }

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                showUserAvatar={true}
                onSend={messages => onSend(messages)}
                user={{
                    _id: route.params.employee.id,
                    name: route.params.employee.name,
                    avatar: route.params.img
                }}
                renderBubble={props => {
                    return (
                        <Bubble
                            {...props}

                            textStyle={{
                                right: {

                                    color: 'black',
                                    fontFamily: "ArchivoNarrow-Bold"
                                },
                                left: {
                                    color: 'black',
                                    fontFamily: "ArchivoNarrow-Bold"
                                },
                            }}
                            wrapperStyle={{
                                left: {
                                    ...styles.bubbleBase,
                                    backgroundColor: '#C3FEF4',
                                },
                                right: {
                                    ...styles.bubbleBase,
                                    backgroundColor: "#D8EAE7",
                                },
                            }}
                        />
                    );
                }}
                renderTime={props =>
                    <Time
                        {...props}
                        timeTextStyle={{
                            left: {
                                color: 'black',
                            },
                            right: {
                                color: 'black',
                            },
                        }}
                    />
                }
            />
            <ImageBackground source={Images.login_bg} style={styles.backgroundImage} />
        </View>

    );
}



const styles = StyleSheet.create({
    bubbleBase: {
        elevation: 5,
        marginTop: 10,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        width: '100%',
        backgroundColor: "#2D2D2D99",
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        minHeight: 50,
        borderColor: "transparent",
    },
    goBack: {
        width: 25,
        height: 25,
        marginLeft: 10,
        marginVertical: 13
    },
    headerName: {
        ...Fonts.H3,
        textAlign: 'center',
        color: "white"
    },
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.4
    },
})

export default Chat;
