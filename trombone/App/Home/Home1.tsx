import React, { useCallback, useEffect, useState } from 'react';
import Colors from '@app/Colors';
import { StyleSheet, View, Image, Text, FlatList, TextInput } from 'react-native';
import Icons from '@app/Icons';
import HomeBackground from './HomeBackground';
import Fonts from '@app/Fonts';
import Button from '@app/Components/Button';
import { newNote, getAllNotes, Note, deleteNote, deleteAllNotes } from './NoteUtils';

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

export default function Home1() {
    const [timeLeft, setTimeLeft] = useState(25)
    const [isStarted, setIsStarted] = useState(false)
    const [note, setNote] = useState<Note[]>([])
    const [newNoteString, setNewNoteString] = useState('')

    useEffect(() => {
        getAllNotes().then((notes) => {
            setNote(notes)
        })
    }, [])

    const renderItem = useCallback((data: { item: Note }): JSX.Element => {
        return (
            <View style={styles.middle}>
                <Text style={Fonts.H3}>{data.item.date}</Text>
                <Text style={Fonts.H4}>{data.item.note}</Text>
            </View>
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

    useEffect(() => {
        if (isStarted) {
            const interval = setInterval(() => {
                if (timeLeft > 0) {
                    setTimeLeft(timeLeft - 1)
                }
            }, 1000 * 60)
            return () => clearInterval(interval)
        }
    }, [timeLeft, isStarted])

    return (
        <HomeBackground style={{justifyContent: 'center'}} pageIndex={1}>
            <View style={styles.widget}>
                <View style={styles.title}>
                    <Image source={Icons.tomato} style={styles.tomato} />
                    <Text style={styles.textTitle}>Technique Pomodoro</Text>
                </View>
                <View style={styles.middle}>
                    {isStarted ? (
                        <Text style={Fonts.H1}>Plus que</Text>
                    ) : (
                        <></>
                    )}
                    <Text style={Fonts.H1}>
                        {timeLeft} min
                    </Text>
                </View>
                <View style={styles.botom}>
                    {isStarted ? (
                        <Text>minuteur en cours...</Text>
                    ) : (
                        <Button onPress={() => setIsStarted(true)} style={styles.button}>
                            <Text style={{marginVertical: 10, marginHorizontal: 20}}>Démarer</Text>
                        </Button>
                    )}
                </View>
            </View>
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
                    style={{height: 250}}
                />
            </View>
        </HomeBackground>
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
