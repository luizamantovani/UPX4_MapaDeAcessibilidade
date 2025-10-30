import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../styles/theme';

type AlertType = 'info' | 'success' | 'error';

interface AlertBoxProps {
  visible: boolean;
  title?: string;
  message?: string;
  type?: AlertType;
  onClose?: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ visible, title, message, type = 'info', onClose }) => {
  const bgColor = type === 'error' ? theme.colors.danger : type === 'success' ? theme.colors.success : theme.colors.accent;
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
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  headerText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.bold,
  },
  body: {
    padding: theme.spacing.lg,
  },
  message: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  footer: {
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.text,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: theme.fonts.semibold,
  },
});

export default AlertBox;
