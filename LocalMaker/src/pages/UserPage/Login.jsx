import React, { useState } from 'react';
import { Formik } from 'formik';
import { Text, View, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { loginValidationSchema } from '../../validationSchemas/login';
import { loginRequest } from '../../services/user.services';
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../../Components/Input';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const initialValues = {
    username: '',
    password: ''
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1a202c',
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
    },
    form: {
      width: '80%',
      backgroundColor: '#ffff',
      padding: 20,
      borderRadius: 10,
    },
    input: {
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      color: '#ffff',
      marginBottom: 15,
    },
    button: {
      backgroundColor: '#00ff00',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#000',
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    registerText: {
      marginTop: 10,
      color: '#000',
      textAlign: 'center',
    },
  });

  const navigate = useNavigate();
  const login = async (values) => {
    try {
      const response = await loginRequest(values);

      if (response && response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        navigate('/HomePage');
      } else {
        setErrorMessage('Usuario o contraseña inválido');
      }
    } catch (error) {
      console.error('Error general al intentar iniciar sesión', error);
      setErrorMessage('Usuario o contraseña inválido');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../img/LogoSinFondo.png')} style={styles.logo} />
      <Text style={{ color: '#fff', fontSize: 24, marginBottom: 20 }}>Login</Text>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={initialValues}
        onSubmit={values => login(values)}
      >
        {({ handleSubmit }) => (
          <View style={styles.form}>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <Input
              placeholder='Usuario'
              name='username'
              style={styles.input}
              placeholderTextColor="#000"
            />
            <Input
              placeholder='Contraseña'
              name='password'
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#000"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/Register')}>
              <Text style={styles.registerText}>¿Aún no tienes una cuenta? Regístrate</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Login;
