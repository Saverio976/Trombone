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
        if (state.value === true) {
            var superEmployee: SuperEmployee = {
                name: "admin", surname: "account",
                id: -1,
                email: "admin@admin.com",
                birth_date: "today",
                gender: "None",
                work: "Admin",
                subordinates: [],
                image: "https://thispersondoesnotexist.com/"
            }
            setMe(superEmployee)
            return
        }
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

    async function AddToEmployees() {

        const v = [index, index + 1, index + 2, index + 3, index + 4, index + 5, index + 6, index + 7]
        if (loading >= 1 || employeesList.length === 0) {
            return;
        }
        if (state.value === true) {
            v.forEach(async i => {
                if (i >= employeesList.length) {
                    return;
                }
                setLoading(loading => loading + 1)
                var currentEmployee = employeesList[i];


                var newDate = new Date()
                var employeeFull: EmployeeFull = { ...currentEmployee, birth_date: String(newDate), gender: "None", work: "Is not a real person", subordinates: [] }
                await (fetch("https://thispersondoesnotexist.com/").then(async response1 => {
                    const blob = await response1.blob();
                    if (response1.status !== 200 || response1.blob === undefined) {
                        return;
                    }
                    const fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(blob);
                    fileReaderInstance.onload = () => {
                        var base64data = fileReaderInstance.result;
                        var img = "data:image/png;" + base64data
                        //@ts-ignore
                        var superEmployee: SuperEmployee = { ...employeeFull, image: img }
                        setEmployees(employees => [...employees, superEmployee])
                        setLoading(loading => loading - 1)
                        setIndex(index => index + 1)
                    }
                }));
            })
            return
        }
        v.forEach(async (i) => {
            console.log(i)
            if (i >= employeesList.length) {
                return;
            }
            setLoading(loading => loading + 1)

            var currentEmployee = employeesList[i];
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
                        console.log(":)")
                        var base64data = fileReaderInstance.result;
                        var img = "data:image/png;" + base64data
                        //@ts-ignore
                        var superEmployee: SuperEmployee = { ...employeeFull, image: img }
                        setEmployees(employees => [...employees, superEmployee])
                        setLoading(loading => loading - 1)
                        setIndex(index => index + 1)
                    }
                })
            })
        })
    }

    useEffect(() => {
        if (state.value === true) {
            setEmployeesList([
                { id: 1, name: "Tracey", surname: "Tucker", email: "tracey.tucker@fake.com" },
                { id: 2, name: "Neil", surname: "Ball", email: "neil.ball@fake.com" },
                { id: 3, name: "Olivia", surname: "Kerr", email: "olivia.kerr@fake.com" },
                { id: 4, name: "Stephen", surname: "Buckland", email: "stephen.buckland@fake.com" },
                { id: 5, name: "Luke", surname: "Mackenzie", email: "luke.mackenzie@fake.com" },
                { id: 6, name: "Katherine", surname: "Buckland", email: "katherine.buckland@fake.com" },
                { id: 7, name: "Jane", surname: "Bailey", email: "jane.bailey@fake.com" },
                { id: 8, name: "Cameron", surname: "Bower", email: "cameron.bower@fake.com" },
                { id: 9, name: "Pippa", surname: "Pullman", email: "pippa.pullman@fake.com" },
                { id: 10, name: "Jan", surname: "Gill", email: "jan.gill@fake.com" },
                { id: 11, name: "Kimberly", surname: "Lewis", email: "kimberly.lewis@fake.com" },
                { id: 12, name: "Liam", surname: "Hemmings", email: "liam.hemmings@fake.com" },
                { id: 13, name: "Heather", surname: "Pullman", email: "heather.pullman@fake.com" },
                { id: 14, name: "Carol", surname: "King", email: "carol.king@fake.com" },
                { id: 15, name: "Stephanie", surname: "Thomson", email: "stephanie.thomson@fake.com" },
                { id: 16, name: "Victor", surname: "Morgan", email: "victor.morgan@fake.com" },
                { id: 17, name: "Una", surname: "Wilson", email: "una.wilson@fake.com" },
                { id: 18, name: "Paul", surname: "Rees", email: "paul.rees@fake.com" },
                { id: 19, name: "James", surname: "Wright", email: "james.wright@fake.com" },
                { id: 20, name: "Sophie", surname: "Ogden", email: "sophie.ogden@fake.com" },
                { id: 21, name: "Jennifer", surname: "Nolan", email: "jennifer.nolan@fake.com" },
                { id: 22, name: "Julia", surname: "Fraser", email: "julia.fraser@fake.com" },
                { id: 23, name: "Virginia", surname: "Morgan", email: "virginia.morgan@fake.com" },
                { id: 24, name: "Warren", surname: "McDonald", email: "warren.mcdonald@fake.com" },
                { id: 25, name: "Angela", surname: "Forsyth", email: "angela.forsyth@fake.com" },
                { id: 26, name: "Joseph", surname: "Powell", email: "joseph.powell@fake.com" },
                { id: 27, name: "Cameron", surname: "Mathis", email: "cameron.mathis@fake.com" },
                { id: 28, name: "Robert", surname: "Chapman", email: "robert.chapman@fake.com" },
                { id: 29, name: "Tim", surname: "Parsons", email: "tim.parsons@fake.com" },
                { id: 30, name: "Gordon", surname: "Ross", email: "gordon.ross@fake.com" },
                { id: 31, name: "Warren", surname: "McLean", email: "warren.mclean@fake.com" },
                { id: 32, name: "Donna", surname: "Rees", email: "donna.rees@fake.com" },
                { id: 33, name: "Olivia", surname: "Edmunds", email: "olivia.edmunds@fake.com" },
                { id: 34, name: "Stewart", surname: "Glover", email: "stewart.glover@fake.com" },
                { id: 35, name: "James", surname: "Poole", email: "james.poole@fake.com" },
                { id: 36, name: "Sam", surname: "Dowd", email: "sam.dowd@fake.com" },
                { id: 37, name: "Joanne", surname: "Campbell", email: "joanne.campbell@fake.com" },
                { id: 38, name: "Matt", surname: "Taylor", email: "matt.taylor@fake.com" },
                { id: 39, name: "Carl", surname: "Sutherland", email: "carl.sutherland@fake.com" },
                { id: 40, name: "Sam", surname: "Avery", email: "sam.avery@fake.com" },
            ])
            return
        }
        apiEmployees(state.value).then(employees => {
            if (employees.json !== undefined) {
                setEmployeesList(employees.json)
            }
        })
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
        flex: 1 / 2,
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
