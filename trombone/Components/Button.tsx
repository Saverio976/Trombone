import Colors from "@app/Colors.ts";
import React from "react";
import { TouchableOpacity } from "react-native";

interface ButtonProps {
    color?: string,
}

const Button: React.FC<TouchableOpacity & ButtonProps> = (props) => {
    return <TouchableOpacity style={{backgroundColor: props.color}} {...props}>
        {props.children}
    </TouchableOpacity>
}

Button.defaultProps =
{
    color: Colors.secondary
}

export default Button

