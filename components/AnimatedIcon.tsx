import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface AnimatedIconProps {
    name: string;
    color: string;
    size: number;
    isFocused: boolean;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ name, color, size, isFocused }) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(scale, {
            toValue: isFocused ? 1.2 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isFocused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <AntDesign name={name} size={size} color={color} />
        </Animated.View>
    );
};

export default AnimatedIcon;