import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import icons from "../constants/icons";

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText?: (text: string) => void;
  otherStyles?: string;
  isDisabled?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  options?: { label: string; value: string }[]; // Ajout des options pour RNPickerSelect
  isDropdown?: boolean; // Pour différencier si c'est un champ de texte ou un RNPickerSelect
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = "",
  isDisabled = false,
  keyboardType = "default",
  options = [],
  isDropdown = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View
        className={`border-2 border-black-200 w-full h-16 px-4 bg-black-100 
          rounded-2xl focus:border-secondary items-center flex-row ${
            isDisabled ? "bg-opacity-50" : ""
          }`}
      >
        {isDropdown ? (
          <RNPickerSelect
            onValueChange={(value) =>
              handleChangeText && handleChangeText(value)
            }
            items={options.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            placeholder={{ label: placeholder, value: null }}
            value={value}
            style={{
              inputIOS: {
                color: "white",
                fontSize: 16,
                height: "100%", // Ensure it takes the full height
                justifyContent: "center",
              },
              inputAndroid: {
                color: "white",
                fontSize: 16,
                height: "100%", // Ensure it takes the full height
                justifyContent: "center",
                paddingLeft: 0, // Adjust padding to align text properly
                paddingRight: 0, // Adjust padding to align text properly
              },
              placeholder: {
                color: "#7b7b8b",
                fontSize: 16,
              },
              viewContainer: {
                flex: 1, // Ensure it takes up available space
                justifyContent: "center",
              },
            }}
          />
        ) : (
          <TextInput
            className="flex-1 text-white font-psemibold text-base-1"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === "Mot de passe" && !showPassword}
            editable={!isDisabled}
            keyboardType={keyboardType}
          />
        )}
        {title === "Mot de passe" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={isDisabled}
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
