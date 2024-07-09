import { ImageBackground, Pressable, StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { BLACK, WHITE } from '@/constants/Colors';


export default function HomeScreen() {
    const router = useRouter();

    const onPress = () => {router.push('/closet')}

    return (
      <View style={styles.container}>
          <Text style={styles.title}>My Closet</Text>
          <Text style={styles.text}>Welcome!</Text>
          <Pressable style={styles.button} onPress={onPress}>
              <Text style={styles.text}>Proceed</Text>
          </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc5b9',
    width: '100%',
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 65,
    fontWeight: 'bold',
    color: WHITE,
    fontFamily: 'serif',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: BLACK,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: WHITE,
  },
});
