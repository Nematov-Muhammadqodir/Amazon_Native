import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type MenuItem = {
  text: string;
  onSelect: () => void;
  fontFamily?: string;
  fontSize?: number;
  selected?: boolean;
};

type MenuDropdownProps = {
  options: MenuItem[];
  triggerSize?: number;
  triggerColor?: string;
  triggerIcon?: React.ReactNode;
  selected?: string;
};
const MenuDropdown: React.FC<MenuDropdownProps> = ({
  options,
  triggerSize = 24,
  triggerColor = "black",
  triggerIcon,
  selected,
}) => {
  const [menuOpened, setMenuOpened] = React.useState(false);
  return (
    <Menu opened={menuOpened} onBackdropPress={() => setMenuOpened(false)}>
      <MenuTrigger onPress={() => setMenuOpened(true)}>
        {triggerIcon ? (
          triggerIcon
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <AntDesign name="menu" size={triggerSize} color={triggerColor} />
            {selected && <Text>{selected}</Text>}
          </View>
        )}
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            padding: 5,
            borderRadius: 8,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 5,
          },
        }}
      >
        {options.map((item, index) => (
          <MenuOption
            key={index}
            customStyles={{
              optionText: {
                fontFamily: item.fontFamily || "Jakarta-Medium",
                fontSize: item.fontSize || 16,
              },
            }}
            onSelect={() => {
              item.onSelect();
              setMenuOpened(true);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: item.fontFamily || "Jakarta-SemiBold",
                  fontSize: item.fontSize || 16,
                }}
              >
                {item.text}
              </Text>

              {item.selected && (
                <FontAwesome name="check" size={18} color="black" />
              )}
            </View>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default MenuDropdown;
