import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
  useCallback,
} from 'react';
import { TextInputProperties } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

export interface InputProperties extends TextInputProperties {
  name: string;
  icon: string;
}

interface InputValueReferenceProperties {
  value: string;
}

interface InputReferenceProperties {
  focus(): void;
}

const Input: React.RefForwardingComponent<
  InputReferenceProperties,
  InputProperties
> = ({ name, icon, ...rest }, ref) => {
  const inputElementRef = useRef<any>(null);
  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReferenceProperties>({
    value: defaultValue,
  });
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);

  const handleInputFocused = useCallback(() => {
    setFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setFocused(false);
    setFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(reff: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container focused={focused} hasError={!!error}>
      <Icon
        name={icon}
        size={20}
        color={focused || filled ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        onFocus={handleInputFocused}
        onBlur={handleInputBlur}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
