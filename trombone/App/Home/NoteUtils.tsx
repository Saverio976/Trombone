import AsyncStorage from '@react-native-async-storage/async-storage';

export type Note = {
    note: string;
    date: string;
    id: string;
};

const NOTE_KEY = 'note';

export const newNote = async (note: string): Promise<Note | undefined> => {
    const nnote: Note = {
        note,
        date: new Date().toLocaleDateString(),
        id: Math.random().toString(),
    }
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        await AsyncStorage.setItem(NOTE_KEY, JSON.stringify([nnote]));
        return nnote
    }
    const oldJson: Note[] = JSON.parse(old);
    oldJson.unshift(nnote);
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(oldJson));
    return nnote
}

export const getAllNotes = async (): Promise<Note[]> => {
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        return []
    }
    return JSON.parse(old);
}

export const deleteNote = async (id: string) => {
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        return
    }
    const oldJson: Note[] = JSON.parse(old);
    const newJson = oldJson.filter(n => n.id !== id);
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(newJson));
}

export const updateNote = async (id: string, note: string) => {
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        return
    }
    const oldJson: Note[] = JSON.parse(old);
    const newJson = oldJson.map(n => {
        if (n.id === id) {
            n.note = note;
        }
        return n;
    });
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(newJson));
}

export const deleteAllNotes = async () => {
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify([]));
}
