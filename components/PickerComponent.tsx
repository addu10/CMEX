import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../theme/styles';

interface PickerComponentProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: Array<{ label: string; value: string }>;
}

const PickerComponent: React.FC<PickerComponentProps> = ({ selectedValue, onValueChange, items }) => {
  return (
    <View style={globalStyles.input}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={globalStyles.picker}
      >
        {items.map((item) => (
          <Picker.Item label={item.label} value={item.value} key={item.value} style={globalStyles.pickerItem}/>
        ))}
      </Picker>
    </View>
  );
};

export default PickerComponent;