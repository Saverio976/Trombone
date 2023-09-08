import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator } from "react-native";
import { store } from "../Reducer";
import { EmployeeFull, EmployeeSmall, apiEmployee, apiEmployees, apiImage } from "@app/Api";
import Colors from "@app/Colors";
import Icons from "@app/Icons";
import Fonts from "@app/Fonts";
import { Slider } from "@miblanchard/react-native-slider";
import { useNavigation } from "@react-navigation/native";


function Separator() {
    return <View style={{ height: 30 }} />
}

const itemWidth = 80;
const employeeIncrement = 12
type SuperEmployee = EmployeeFull & { image: string }

function Trombinoscope(): JSX.Element {
    const state = store.getState();
    const [employeesList, setEmployeesList] = useState<EmployeeSmall[]>([]);
    const [employees, setEmployees] = useState<SuperEmployee[]>([]);
    const [loading, setLoading] = useState<number>(0);
    const [index, setIndex] = useState<number>(0)
    const [height, setHeight] = useState<number>(300)
    const nav = useNavigation();

    const renderItem = useCallback((data: { item: SuperEmployee, index: number }): JSX.Element => {
        function onPress() {
            //@ts-expect-error
            nav.navigate("UserInfo", { employee: data.item, img: data.item.image })
        }

        return <TouchableOpacity style={styles.item} onPress={onPress}>
            <Image source={{ uri: data.item.image }} style={styles.image} />
            <Text style={styles.itemText} numberOfLines={1}>{data.item.name}</Text>
            <Text style={styles.itemText} numberOfLines={1}>{data.item.surname}</Text>
        </TouchableOpacity>
    }, [nav])

    function AddToEmployees() {
        for (var i = 0; i < employeeIncrement; i++) {
            var j = i + index;
            if (j >= employeesList.length) {
                break;
            }

            var currentEmployee = employeesList[j];
            setLoading(loading => loading + 1)
            apiEmployee(currentEmployee.id, state.value).then((response1) => {
                var employeeFull = response1.json
                if (employeeFull === undefined) {
                    return;
                }
                apiImage(employeeFull.id, state.value).then((response) => {
                    if (response.code !== 200 || response.blob === undefined) {
                        return;
                    }
                    const fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(response.blob);
                    fileReaderInstance.onload = () => {
                        var base64data = fileReaderInstance.result;
                        var img = "data:image/png;" + base64data
                        //@ts-ignore
                        var superEmployee: SuperEmployee = { ...employeeFull, image: img }
                        setEmployees(employees => [...employees, superEmployee])
                        setLoading(loading => loading - 1)
                    }
                })
            })
        }
        setIndex(index + i)
    }

    useEffect(() => {
        if (state.value === true) {

        }
        setLoading(1);
        apiEmployees(state.value).then(employees => {
            if (employees.json !== undefined) {
                setEmployeesList(employees.json)
            }
        }).finally(() => setLoading(0));
        AddToEmployees();
    }, []);

    useEffect(() => {
        if (employeesList.length > 0) {
            AddToEmployees();
        }
    }, [employeesList])

    function Footer() {
        return <ActivityIndicator animating={loading >= 1} style={{ marginBottom: 20, marginTop: 15, }} />
    }

    return (<View style={[styles.background, { height }]}>
        <Slider value={height} containerStyle={styles.sliderContainer} onValueChange={num => setHeight(num[0])} minimumValue={250} maximumValue={500} />
        <View style={styles.searchWrapper}>
            <View style={styles.searchBox}>
                <Image source={Icons.search} style={styles.searchIcon} />
                <TextInput placeholderTextColor="#00000066" style={{ padding: 0 }} placeholder="Rechercher..." />
            </View>
            <TouchableOpacity style={styles.filterButton}>
                <>
                    <Image source={Icons.sort} style={styles.filterIcon} />
                    <Text style={styles.filterText}>Trier par</Text>
                </>
            </TouchableOpacity>

        </View>
        <FlatList
            data={employees}
            renderItem={renderItem}
            numColumns={3}
            contentContainerStyle={styles.flatListContainer}
            columnWrapperStyle={styles.columnWrapper}
            ItemSeparatorComponent={Separator}
            scrollEnabled={true}
            style={styles.flatList}
            ListFooterComponent={Footer}
            onEndReached={AddToEmployees}
            onEndReachedThreshold={6}
            extraData={nav}
        />
    </View>)
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        borderColor: "black",
        elevation: 10,
    },
    columnWrapper: {
        justifyContent: "space-between"
    },
    flatListContainer: {
        paddingHorizontal: 20,
    },
    flatList: {
        height: 250,
        marginVertical: 20,
    },
    image: {
        width: itemWidth,
        height: itemWidth,
        backgroundColor: "coral",
        borderRadius: 12,
    },
    item: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: itemWidth
    },
    itemText: {
        width: itemWidth,
        textAlign: "center",
        color: Colors.text,
    },
    searchWrapper: {
        height: 25,
        marginTop: 5,
        marginHorizontal: 13,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    searchBox: {
        flex: 1,
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        paddingRight: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    filterButton: {
        backgroundColor: "#B4B4B4",
        borderRadius: 10,
        width: 70,
        marginLeft: -20,
        flexDirection: "row",
        alignItems: "center",
    },
    searchIcon: {
        width: 13,
        height: 13,
        marginRight: 9,
        marginLeft: 6,
    },
    filterIcon: {
        width: 13,
        height: 14,
        marginLeft: 6,
    },
    filterText: {
        ...Fonts.text,
        fontSize: 10,
        marginLeft: 3,
    },
    sliderContainer: {
        marginHorizontal: 30,
    },
})

export default Trombinoscope
