import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableOpacity } from "react-native";
import { store } from "../Reducer";
import { EmployeeFull, EmployeeSmall, apiEmployee, apiEmployees, apiImage } from "@app/Api";
import Colors from "@app/Colors";
import Icons from "@app/Icons";
import Fonts from "@app/Fonts";


function Separator() {
    return <View style={{ height: 30 }} />
}


function renderItem(data: { item: SuperEmployee, index: number }): JSX.Element {
    return <TouchableOpacity style={styles.item}>
        <Image source={{uri: data.item.image}} style={styles.image}/>
        <Text style={styles.itemText} numberOfLines={1}>{data.item.name}</Text>
        <Text style={styles.itemText} numberOfLines={1}>{data.item.surname}</Text>
    </TouchableOpacity>
}

const itemWidth = 80;
const employeeIncrement = 9
type SuperEmployee = EmployeeFull & {image: string}

function Trombinoscope(): JSX.Element {
    const state = store.getState();
    const [employeesList, setEmployeesList] = useState<EmployeeSmall[]>([]);
    const [employees, setEmployees] = useState<SuperEmployee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0)

    function AddToEmployees() {
        setLoading(true);
        for (var i = 0; i < employeeIncrement; i++) {
            var j =  i + index;
            if (j >= employeesList.length) {
                break;
            }

            var currentEmployee = employeesList[j];

            apiEmployee(currentEmployee.id, state.value).then((response1) => {
                var employeeFull = response1.json
                if (employeeFull === undefined) {
                    return;
                }
                apiImage(employeeFull.id, state.value).then((response) => {
                    if (response.code !== 200 || response.blob === undefined) {
                        console.log(response)
                        return;
                    }
                    const fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(response.blob);
                    fileReaderInstance.onload = () => {
                        var base64data = fileReaderInstance.result;
                        var img = "data:image/png;" + base64data
                        //@ts-ignore
                        var superEmployee: SuperEmployee = {...employeeFull, image: img}
                        setEmployees(employees => [...employees, superEmployee])
                    }
                })
            })
        }
        setIndex(index + i)
        setLoading(false);
    }

    useEffect(() => {
        if (state.value === true) {

        }
        setLoading(true);
        apiEmployees(state.value).then(employees => {
            if (employees.json !== undefined) {
                setEmployeesList(employees.json)
            }
        }).finally(() => setLoading(false));
        AddToEmployees();
    }, []);

    useEffect(() => {
        if (employeesList.length > 0) {
            AddToEmployees();
        }
    }, [employeesList])

    useEffect(() => {
    }, [employees])

    return (<View style={styles.background}>
        <View style={styles.searchWrapper}>
            <View style={styles.searchBox}>
                <Image source={Icons.search} style={styles.searchIcon}/>
                <TextInput placeholderTextColor="#00000066" style={{padding: 0,}} placeholder="Rechercher..."/>
            </View>
            <TouchableOpacity style={styles.filterButton}>
                <>
                <Image source={Icons.sort} style={styles.filterIcon}/>
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
            refreshing={loading}
            onEndReached={AddToEmployees}
            onEndReachedThreshold={2}
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
        textAlign: "center"
    },
    searchWrapper: {
        height: 25,
        marginTop: 13,
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
    }
})

export default Trombinoscope
