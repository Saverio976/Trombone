import Colors from "@app/Colors";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps {
    color?: string,
}

const Button: React.FC<TouchableOpacityProps & ButtonProps> = (props) => {
    return <TouchableOpacity style={{backgroundColor: props.color}} {...props}>
        {props.children}
    </TouchableOpacity>
}

Button.defaultProps =
{
    color: Colors.secondary
}

export default Button

