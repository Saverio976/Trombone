import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLastToken(): Promise<string | null> {
    return await AsyncStorage.getItem('access_token');
}

export async function setLastToken(token: string) {
    return await AsyncStorage.setItem('access_token', token);
}
