import { StyleSheet, Pressable } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Gallery from '@/components/Gallery'; // Correct import

export default function ClosetScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.btnGroup}>
        <Pressable style={[styles.button, styles.leftButton]}>
          <Text style={styles.buttonText}>Outfit</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.rightButton]}>
          <Text style={styles.buttonText}>Item</Text>
        </Pressable>
      </View>
      <Gallery />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  leftButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
