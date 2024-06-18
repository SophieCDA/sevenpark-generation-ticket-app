import { View, Text, Image } from "react-native";
import images from "@/constants/images";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="text-xl text-center font-psemibold text-white">
        {props.title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100 mt-2">
        {props.subtitle}
      </Text>
    </View>
  );
};

export default EmptyState;
