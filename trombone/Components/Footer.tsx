import Colors from '@app/Colors';
import Icons from '@app/Icons';
import Button from '@app/Components/Button';
import { Animated, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

function  navigateName(navigation: any, name: string, key: string) {
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
  const goLeft = () => {
      let route = undefined
      if (state.index === 0) {
          route = state.routes[state.routeNames.length - 1]
      } else {
          route = state.routes[state.index - 1]
      }

      navigateName(navigation, route.name, route.key)
  }
  const goRight = () => {
      let route = undefined;
      if (state.index === state.routeNames.length - 1) {
          route = state.routes[0]
      } else {
          route = state.routes[state.index + 1]
      }

      navigateName(navigation, route.name, route.key)
  }

  return (
    <View style={styles.container}>
        <Button onPress={() => { goLeft() }} >
            <Image source={Icons.arrowLeft} style={styles.arrowLeftIcon} />
        </Button>
        <View style={{ flexDirection: 'row' }}>
          {state.routes.map((route: any, index: any) => {
            const { options } = descriptors[route.key];

            const isFocused = state.index === index;

            const onPress = () => {
              navigateName(navigation, route.name, route.key)
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                key={index}
              >
                <Animated.View style={(isFocused ? styles.circlePlain : styles.circleEmpty)} />
              </TouchableOpacity>
            );
          })}
        </View>
        <Button onPress={() => { goRight() }} >
            <Image source={Icons.arrowRight} style={styles.arrowRightIcon} />
        </Button>
    </View>
  );
}

const styles = StyleSheet.create({
    circlePlain: {
        marginVertical: 10,
        width: 20,
        height: 20,
        borderRadius: 50000,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: Colors.gradient1,
        marginHorizontal: 5
    },
    circleEmpty: {
        marginVertical: 10,
        width: 20,
        height: 20,
        borderRadius: 50000,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: Colors.secondary,
        marginHorizontal: 5
    },
    container: {
        backgroundColor: Colors.secondary,
        elevation: 10,
        shadowColor: "0x40000000",
        borderRadius: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
    arrowLeftIcon: {
        marginLeft: 14,
        marginRight: 15,
        width: 33,
        height: 33,
        alignSelf: "center",
        resizeMode: "contain",
    },
    arrowRightIcon: {
        marginLeft: 14,
        marginRight: 15,
        width: 33,
        height: 33,
        alignSelf: "center",
        resizeMode: "contain",
    },
})
