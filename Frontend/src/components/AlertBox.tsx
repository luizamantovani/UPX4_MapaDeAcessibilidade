import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

type AlertType = 'info' | 'success' | 'error';

interface AlertBoxProps {
  visible: boolean;
  title?: string;
  message?: string;
  type?: AlertType;
  onClose?: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ visible, title, message, type = 'info', onClose }) => {
  const bgColor = type === 'error' ? '#ff6b6b' : type === 'success' ? '#4caf50' : '#2196f3';
  const scale = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    } else {
      scale.setValue(0.8);
    }
  }, [visible, scale]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
          <View style={[styles.header, { backgroundColor: bgColor }]}> 
            <Text style={styles.headerText}>{title ?? (type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : 'Aviso')}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={onClose} accessibilityRole="button">
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  body: {
    padding: 18,
  },
  message: {
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AlertBox;
