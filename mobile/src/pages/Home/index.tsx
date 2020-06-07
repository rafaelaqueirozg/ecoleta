import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  Alert
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


interface IBGEUFReponse {
  sigla: string;
}

interface IBGECityReponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get<IBGEUFReponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios.get<IBGECityReponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome);
      setCities(cityNames);
      setSelectedCity('');
    });
  }, [selectedUf]);


  function handleNavigationToPoints() {
    if (selectedUf && selectedCity) {
      navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
    } else {
      Alert.alert('Campos Obrigatórios', 'Selecione um estado e uma cidade!');
    }
  }

  function handleSelectUf(value: string) {
    const uf = value;
    setSelectedUf(uf);
  }

  function handleSelectCity(value: string) {
    const city = value;
    setSelectedCity(city);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ height: 368, width: 274 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.selectsContainer}>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={pickeStyle}
          Icon={() => {
            return (
              <View style={styles.selectIcon}>
                <Icon
                  name="chevron-down"
                  color="#696969"
                  size={18}
                />
              </View>
            )
          }}
          value={selectedUf}
          onValueChange={handleSelectUf}
          items={ufs.map(uf => ({
            label: uf,
            value: uf,
            key: uf
          }))}
          placeholder={{
            label: 'Selecione um estado',
            value: null
          }}
        />

        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={pickeStyle}
          Icon={() => {
            return (
              <View style={styles.selectIcon}>
                <Icon
                  name="chevron-down"
                  color="#696969"
                  size={18}
                />
              </View>
            )
          }}
          value={selectedCity}
          onValueChange={handleSelectCity}
          items={cities.map(city => ({
            label: city,
            value: city,
            key: city
          }))}
          placeholder={{
            label: 'Selecione uma cidade',
            value: null
          }}
        />
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const pickeStyle = StyleSheet.create({
  placeholder: {
    fontSize: 16,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  inputIOS: {
    fontSize: 16,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  inputAndroid: {
    fontSize: 16,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  selectsContainer: {
    marginBottom: 15
  },

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  selectIcon: {
    height: 60,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
