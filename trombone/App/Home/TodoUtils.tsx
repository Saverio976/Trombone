import AsyncStorage from '@react-native-async-storage/async-storage';

export type Todo = {
    todo: string;
    date: string;
    id: string;
};

const NOTE_KEY = 'todo';

export const newTodo = async (todo: string) => {
    const ntodo: Todo = {
        todo,
        date: new Date().toLocaleDateString(),
        id: Math.random().toString(),
    }
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        await AsyncStorage.setItem(NOTE_KEY, JSON.stringify([ntodo]));
        return
    }
    const oldJson: Todo[] = JSON.parse(old);
    oldJson.unshift(ntodo);
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(oldJson));
}

export const getAllTodos = async (): Promise<Todo[]> => {
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        return []
    }
    return JSON.parse(old);
}

export const deleteTodo = async (id: string) => {
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        return
    }
    const oldJson: Todo[] = JSON.parse(old);
    const newJson = oldJson.filter(n => n.id !== id);
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(newJson));
}

export const updateTodo = async (id: string, todo: string) => {
    const old = await AsyncStorage.getItem(NOTE_KEY);
    if (old === null) {
        return
    }
    const oldJson: Todo[] = JSON.parse(old);
    const newJson = oldJson.map(n => {
        if (n.id === id) {
            n.todo = todo;
        }
        return n;
    });
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(newJson));
}

export const deleteAllTodos = async () => {
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify([]));
}
