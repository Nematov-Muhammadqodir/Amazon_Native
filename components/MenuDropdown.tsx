import { AntDesign } from "@expo/vector-icons";
import React from "react";
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
};

type MenuDropdownProps = {
  options: MenuItem[];
  triggerSize?: number;
  triggerColor?: string;
};

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  options,
  triggerSize = 24,
  triggerColor = "black",
}) => {
  return (
    <Menu>
      <MenuTrigger>
        <AntDesign name="menu" size={triggerSize} color={triggerColor} />
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
                fontFamily: item.fontFamily || "Jakarta-ExtraBold",
                fontSize: item.fontSize || 16,
              },
            }}
            onSelect={item.onSelect}
            text={item.text}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default MenuDropdown;
