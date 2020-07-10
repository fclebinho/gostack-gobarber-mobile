import React, { useRef, useCallback } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { api } from '../../services';
import { Container, Title, SignInButton, SignInButtonText } from './styles';
import { Input, Button } from '../../components';
import logo from '../../assets/logo.png';

import { getValidatorError } from '../../utils/validator-error';

export interface SignUpFormDataProps {
  name: string;
  email: string;
  password: string;
}

export const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputPasswordRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFormDataProps) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('Email é obrigatório')
            .email('Digite um email válido'),
          password: Yup.string().min(6, 'Senha deve ter no mínimo 6 dígitos'),
        });

        await schema.validate(data, { abortEarly: false });
        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso',
          'Você já pode realizar login na aplicação',
        );

        navigation.goBack();

        // await signIn({
        //   email: data.email,
        //   password: data.password,
        // });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidatorError(err);
          formRef.current?.setErrors(errors);
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu erro ao fazer login, rever suas informações',
        );

        // addToast({
        //   title: 'Erro inesperado',
        //   description: 'Ocorreu erro no servidor',
        //   type: 'error',
        // });
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logo} />
            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => inputEmailRef.current?.focus()}
              />
              <Input
                ref={inputEmailRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => inputPasswordRef.current?.focus()}
              />
              <Input
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <SignInButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <SignInButtonText>Voltar para login</SignInButtonText>
      </SignInButton>
    </>
  );
};

export default SignUp;
