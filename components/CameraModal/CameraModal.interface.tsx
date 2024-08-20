interface CameraModalProps {
    visible: boolean;
    onClose: () => void;
    onScan: ({ data }: { data: string }) => void;
    onManualScan: () => void;
}