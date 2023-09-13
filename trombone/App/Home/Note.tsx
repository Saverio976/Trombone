import React, { useCallback, useEffect, useState } from 'react';
import Colors from '@app/Colors';
import { StyleSheet, View, Image, Text, FlatList, TextInput, Animated, TouchableOpacity } from 'react-native';
import Icons from '@app/Icons';
import HomeBackground from './HomeBackground';
import Fonts from '@app/Fonts';
import Button from '@app/Components/Button';
import { newNote, getAllNotes, Note, deleteNote, deleteAllNotes } from './NoteUtils';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

interface inputBoxProps {
    hidden?: boolean;
    setFunc: (value: string) => void;
    title: string;
    str: string;
    placeholder: string;
}

function InputBox({ hidden = false, setFunc, title, str, placeholder }: inputBoxProps): JSX.Element {
    return <View style={styles.inputBox}>
        <View style={styles.innerInputBox}>
            <Text style={styles.inputBoxTitle}>{title}</Text>
            <TextInput onChangeText={setFunc} secureTextEntry={hidden} style={styles.inputBoxInput} value={str} placeholder={placeholder}
                placeholderTextColor="#CCC"></TextInput>
        </View>
    </View>
}

export default function Notes() {
    const [note, setNote] = useState<Note[]>([])
    const [newNoteString, setNewNoteString] = useState('')

    useEffect(() => {
        getAllNotes().then((notes) => {
            setNote(notes)
        })
    }, [])


    const renderItem = useCallback((data: { item: Note }): JSX.Element => {
        function onSwipe() {
            a_deleteNote(data.item.id)
        }

        const renderLeftActions = (progress: any, dragX: number) => {
            //@ts-expect-error
            const trans = dragX.interpolate({
                inputRange: [0, 1],
                outputRange: [-51, -50],
            });
            //@ts-expect-error
            const scale = dragX.interpolate({
                inputRange: [0, 40, 100],
                outputRange: [0, 1, 1]
            })
            return (
                <Animated.View
                    style={[
                        {
                            transform: [{translateX: trans}, { scale: scale }],
                        },
                    ]}>
                    <TouchableOpacity onPress={onSwipe} style={{ backgroundColor: "red", aspectRatio: 1, height: "100%" }}>
                        <Image source={Icons.chatArrow} style={{ resizeMode: "center", aspectRatio: 1, height: "100%" }} />
                    </TouchableOpacity>
                </Animated.View>
            );
        };
        return (
            //@ts-expect-error
            <Swipeable renderLeftActions={renderLeftActions}>
                <View style={styles.middle}>
                    <Text style={Fonts.H3}>{data.item.date}</Text>
                    <Text numberOfLines={1} style={[Fonts.H4, { width: "100%", paddingHorizontal: 20, }]}>{data.item.note}</Text>
                </View>
            </Swipeable>
        )
    }, [])

    const a_newNote = async (note: string) => {
        newNote(note).then(() => {
            getAllNotes().then((notes) => {
                setNote(notes)
            })
            setNewNoteString('')
        });
    }
    const a_deleteNote = async (id: string) => {
        deleteNote(id).then(() => {
            getAllNotes().then((notes) => {
                setNote(notes)
            })
        });
    }
    const a_deleteAllNotes = async () => {
        deleteAllNotes().then(() => {
            getAllNotes().then((notes) => {
                setNote(notes)
            })
        });
    }

    return (
        <View style={{ ...styles.widget, marginTop: 20 }}>
            <Button onPress={() => a_deleteAllNotes()} style={{ ...styles.button, margin: 5, alignItems: 'center' }}>
                <Text style={Fonts.text}>Supprimer toutes les notes</Text>
            </Button>
            <View>
                <InputBox title="Nouvelle note" placeholder="note..." setFunc={setNewNoteString} str={newNoteString} />
                <Button onPress={() => a_newNote(newNoteString)} style={{ ...styles.button, margin: 5, alignItems: 'center' }}>
                    <Text style={Fonts.text}>+</Text>
                </Button>
            </View>
            <FlatList
                data={note}
                numColumns={1}
                renderItem={renderItem}
                scrollEnabled={true}
                style={{ height: 250 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    widget: {
        backgroundColor: Colors.secondary,
        borderRadius: 50,
    },
    title: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    middle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "black",
    },
    botom: {
        marginBottom: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tomato: {
        width: 37,
        height: 33,
    },
    button: {
        borderRadius: 500,
        backgroundColor: Colors.gradient1,
    },
    textTitle: {
        ...Fonts.H2,
        marginLeft: 10,
    },
    inputBoxTitle: {
        ...Fonts.text,
        color: Colors.text,
        marginTop: 6,
    },
    innerInputBox: {
        flex: 1,
    },
    inputBox: {
        backgroundColor: Colors.light,
        elevation: 10,
        shadowColor: "0x40000000",
        borderRadius: 2,
        flexDirection: "row",
        alignContent: "center",
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
