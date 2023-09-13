import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { store } from "../Reducer";
import { EmployeeFull, EmployeeSmall, apiEmployee, apiEmployees, apiImage, apiMe } from "@app/Api";
import Colors from "@app/Colors";
import Icons from "@app/Icons";
import Fonts from "@app/Fonts";
import { Slider } from "@miblanchard/react-native-slider";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";


function Separator() {
    return <View style={{ height: 30 }} />
}

const employeeIncrement = 4
type SuperEmployee = EmployeeFull & { image: string }

const itemWidth = ((Dimensions.get("window").width - 50) / 3) * (3 / 4);
function Trombinoscope(): JSX.Element {
    const state = store.getState();
    const [employeesList, setEmployeesList] = useState<EmployeeSmall[]>([]);
    const [employees, setEmployees] = useState<SuperEmployee[]>([]);
    const [loading, setLoading] = useState<number>(0);
    const [index, setIndex] = useState<number>(0)
    const [me, setMe] = useState<undefined | SuperEmployee>()
    const nav = useNavigation();

    useEffect(() => {
        apiMe(state.value).then(response1 => {
            if (response1.code !== 200 || response1.json === undefined) {
                Toast.show({
                    type: "error",
                    text1: "Erreur fatale",
                    text2: "Impossible de récupérer les données de l'utilisateur",
                })
                console.error(response1)
                return
            }
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
                    setMe(superEmployee)
                }
            })
        })
    }, [])

    const renderItem = useCallback((data: { item: SuperEmployee, index: number }): JSX.Element => {
        function onPress() {
            //@ts-expect-error
            nav.navigate("UserInfo", { employee: data.item, img: data.item.image, me, meImg: me?.image })
        }

        return <View style={styles.item}>
            <TouchableOpacity style={{ backgroundColor: "#7FB3AA", width: "75%", borderRadius: 20, alignItems: "center", elevation: 6 }} onPress={onPress}>
                <Image source={{ uri: data.item.image }} style={styles.image} />
                <Text style={styles.itemText} numberOfLines={2}>{data.item.name} {data.item.surname}</Text>
            </TouchableOpacity>
        </View>
    }, [nav, me])

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

    return (<View style={styles.background}>
        {/* <View style={styles.searchWrapper}>
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
        </View> */}
        <FlatList
            data={employees}
            renderItem={renderItem}
            numColumns={2}
            initialNumToRender={10}
            contentContainerStyle={styles.flatListContainer}
            columnWrapperStyle={styles.columnWrapper}
            ItemSeparatorComponent={Separator}
            scrollEnabled={true}
            style={styles.flatList}
            ListFooterComponent={Footer}
            onEndReached={AddToEmployees}
            onEndReachedThreshold={1}
        />
    </View>)
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    flatListContainer: {
    },
    flatList: {
        paddingVertical: 20,
    },
    image: {
        aspectRatio: 1,
        width: "100%",
        backgroundColor: "lightcyan",
        borderRadius: 20,
    },
    item: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1/2,
    },
    itemText: {
        width: "100%",
        paddingHorizontal: 10,
        fontFamily: "ArchivoNarrow-Bold",
        textAlign: "center",
        fontSize: 15,
        color: "#2D2D2D",
        height: 52,
        justifyContent: "center",
        textAlignVertical: "center"
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
})

export default Trombinoscope
