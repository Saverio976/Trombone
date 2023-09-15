import React, { useCallback, useEffect, useState } from 'react';
import Colors from '@app/Colors';
import { StyleSheet, View, Image, Text, FlatList, TextInput, Animated, TouchableOpacity } from 'react-native';
import Icons from '@app/Icons';
import Fonts from '@app/Fonts';
import Button from '@app/Components/Button';
import { newNote, getAllNotes, Note, deleteNote, deleteAllNotes, updateNote } from './NoteUtils';

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
    const [stateRender, setStateRender] = useState<Note | undefined>(undefined)
    const [rendered, setRendered] = useState<JSX.Element>(<></>)

    useEffect(() => {
        getAllNotes().then((notes) => {
            setNote(notes)
        })
    }, [])


    const renderItem = (data: { item: Note }): JSX.Element => {
        return (
            <Button onPress={() => setStateRender(data.item)} style={{ borderColor: Colors.dark, borderWidth: 1 }}>
                <Text numberOfLines={1}>{data.item.note}</Text>
            </Button>
        )
    }

    const a_newNote = async () => {
        newNote('').then((nnote) => {
            getAllNotes().then((notes) => {
                setNote(notes)
            })
            if (nnote !== undefined) {
                setStateRender(nnote)
            }
        });
    }
    const a_deleteNote = async (id: string) => {
        deleteNote(id).then(() => {
            getAllNotes().then((notes) => {
                setNote(notes)
            })
        });
    }

    const a_editNote = async (id: string, note: string) => {
        updateNote(id, note).then(() => {
            getAllNotes().then((notes) => {
                setNote(notes)
                if (stateRender !== undefined && stateRender.id === id) {
                    setStateRender({ ...stateRender, note: note })
                }
            })
        })
    }

    useEffect(() => {
        if (stateRender === undefined) {
            setRendered(
                <View style={{ ...styles.widget, paddingTop: 10, }}>
                    <FlatList
                        data={note}
                        numColumns={1}
                        renderItem={renderItem}
                        scrollEnabled={true}
                        style={{ height: 250 }}
                    />
                </View>
            )
        } else {
            if (stateRender.note === '') {
                setRendered(
                    <TextInput onChangeText={(e) => a_editNote(stateRender.id, e)} placeholder={'Note...'}></TextInput>
                )
            } else {
                setRendered(
                    <TextInput onChangeText={(e) => a_editNote(stateRender.id, e)} value={stateRender.note}></TextInput>
                )
            }
        }
    }, [stateRender, note])

    return (
        <View style={{ ...styles.widget, paddingTop: 10, }}>
            <View style={styles.header}>
                <Button onPress={() => setStateRender(undefined)} color={Colors.dark}>
                    <Image source={Icons.menu} style={styles.tomato} />
                </Button>
                <Text style={styles.textTitle}>Notes</Text>
                <Button onPress={() => a_newNote()} color={Colors.dark}>
                    <Image source={Icons.plus} style={styles.tomato} />
                </Button>
                {stateRender !== undefined ? (
                    <Button onPress={() => { a_deleteNote(stateRender.id); setStateRender(undefined) }} color={Colors.dark}>
                        <Text style={{ ...Fonts.H3, color: 'red'}}>Supprimer</Text>
                    </Button>
                ) : (
                    <></>
                )}
            </View>
            {rendered}
        </View>
    )
}

const styles = StyleSheet.create({
    widget: {
        backgroundColor: Colors.dark,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 35,
    },
    middle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "black",
    },
    botom: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tomato: {
        width: 37,
        height: 33,
    },
    button: {
        borderRadius: 500,
    },
    textTitle: {
        ...Fonts.H2,
    },
    inputBoxTitle: {
        ...Fonts.text,
        marginTop: 6,
    },
    innerInputBox: {
        flex: 1,
    },
    inputBox: {
        elevation: 10,
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
        // borderBottomWidth: 1,
        color: "#000",
    }
})
