import Colors from '@app/Colors';
import Icons from '@app/Icons';
import Button from '@app/Components/Button';
import { Animated, View, StyleSheet, Image, } from 'react-native';
import { useEffect, useRef } from 'react';

function navigateName(navigation: any, name: string, key: string) {
    const event = navigation.emit({
      type: 'tabPress',
      target: key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({ name: name, merge: true });
    }
}

export function MyTabBar({ state, descriptors, navigation, position }: any) {
    const routeTrombi = state.routes.find((route: any) => route.name === 'Trombi') // Trombi
    const routeWidget = state.routes.find((route: any) => route.name === 'Widget') // Widget

    const angleAnim = useRef(new Animated.Value(180)).current;

    const rotateRight = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(angleAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        }).start();
    };

    const rotateLeft = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(angleAnim, {
        toValue: 180,
        duration: 1000,
        useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (state.index === 0)
            rotateLeft();
        if (state.index === 1)
            rotateRight();
    }, [state.index]);

    const changeRoute = () => {
        if (state.index === 0)
            navigateName(navigation, routeWidget.name, routeWidget.key);
        if (state.index === 1)
            navigateName(navigation, routeTrombi.name, routeTrombi.key);
    }

    return (
        <View style={styles.container}>
            <Button onPress={() => changeRoute()}>
                <Animated.View
                    style={{
                        transform: [{
                            rotate: angleAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] })
                        }]
                    }}
                >
                    <Image source={Icons.arrow} style={ styles.arrow } />
                </Animated.View>
            </Button>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary,
    },
    arrow: {
        marginLeft: 14,
        marginRight: 15,
        width: 33,
        height: 33,
        alignSelf: "center",
        resizeMode: "contain",
    },
})
