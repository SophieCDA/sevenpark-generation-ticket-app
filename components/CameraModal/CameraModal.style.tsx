import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 70,
    },
    cameraActions: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        columnGap: 3,
    },
    buttonCamera: {
        backgroundColor: "#007BFF",
        width: 70,
        height: 70,
        borderRadius: 100
    },
    buttonClose: {
        backgroundColor: "#f44336",
        width: 70,
        height: 70,
        borderRadius: 100
    }
});