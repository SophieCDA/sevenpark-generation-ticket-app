import { CameraView } from "expo-camera";
import { Modal, View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { styles } from "./CameraModal.style";

const CameraModal: React.FC<CameraModalProps> = ({ visible, onClose, onScan, onManualScan }) => {
    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="slide">
            <View style={styles.cameraContainer}>
                <CameraView
                    onBarcodeScanned={onScan}
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.cameraActions}>
                    <IconButton
                        icon="close"
                        style={styles.buttonClose}
                        onPress={onClose}
                    />
                    <IconButton
                        icon="camera"
                        style={styles.buttonCamera}
                        onPress={onManualScan}
                    />
                </View>
            </View>
        </Modal>
    );
};


export default CameraModal;