import Colors from '@app/Colors';
import Icons from '@app/Icons';
import Button from '@app/Components/Button';
import { Animated, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';

export function MyTabBar({ state, descriptors, navigation, position }: any) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_: any, i: any) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i: any) => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Animated.Text style={{ opacity }}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
