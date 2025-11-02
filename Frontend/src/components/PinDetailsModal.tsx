import React from "react";
import { Modal, View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Pin } from "../types/Pin";
import { localStyles } from "../styles";
import { getUser } from "../utils/supabase";
import { deletePin } from "../services/api";
import AlertBox from "./AlertBox";

type Props = {
  pin: Pin | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: () => void;
};

export default function PinDetailsModal({ pin, visible, onClose, onDelete }: Props) {
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [viewerVisible, setViewerVisible] = React.useState(false);
  const [viewerLoading, setViewerLoading] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState<string | undefined>(undefined);
  const [alertMessage, setAlertMessage] = React.useState<string | undefined>(undefined);
  const [alertType, setAlertType] = React.useState<'info'|'success'|'error'>('info');

  React.useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        setCurrentUserId((user as any)?.id ?? null);
      } catch {
        setCurrentUserId(null);
      }
    })();
  }, []);

  if (!pin) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={localStyles.overlay}>
  <View style={[localStyles.modalContent, pin.imageUrl ? localStyles.modalContentWithImage : undefined]}>
          <Text style={localStyles.detailsTitle}>{pin.title}</Text>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
             <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Categoria:</Text>
             <Text style={{ marginLeft: 5, marginBottom: 10, fontSize: 16 }}>
               {pin.category === 'acessivel' ? 'Acessível' : 'Não Acessível'}
             </Text> 
          </View>

          <Text style={{ marginBottom: 10, fontSize: 16 }}>{pin.description}</Text>
         
          {pin.imageUrl && (
            <View style={detailStyles.previewWrapper}>
              <TouchableOpacity onPress={() => setViewerVisible(true)} activeOpacity={0.9} style={{ width: '100%' }}>
                <Image
                  source={{ uri: pin.imageUrl }}
                  style={detailStyles.previewImage}
                  resizeMode="cover"
                  onLoadStart={() => setIsImageLoading(true)}
                  onLoadEnd={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              </TouchableOpacity>
              {isImageLoading && (
                <View style={detailStyles.previewOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </View>
          )}

          {/* Image viewer fullscreen */}
          <Modal visible={viewerVisible} animationType="fade" onRequestClose={() => setViewerVisible(false)}>
            <View style={detailStyles.viewerContainer}>
              <TouchableOpacity style={detailStyles.viewerClose} onPress={() => setViewerVisible(false)}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
              <Image
                source={{ uri: pin.imageUrl || undefined }}
                style={detailStyles.viewerImage}
                resizeMode="contain"
                onLoadStart={() => setViewerLoading(true)}
                onLoadEnd={() => setViewerLoading(false)}
                onError={() => setViewerLoading(false)}
              />
              {viewerLoading && (
                <View style={detailStyles.viewerLoading}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </View>
          </Modal>

          <View style={localStyles.actionsRow}>
            <TouchableOpacity style={localStyles.closeButtonDetails} onPress={onClose} disabled={isDeleting}>
              <Text style={localStyles.actionButtonText}>Fechar</Text>
            </TouchableOpacity>

            {/* Mostrar botão de excluir apenas se for anônimo ou pertencer ao usuário atual */}
            {(pin.userId == null || String(pin.userId) === String(currentUserId)) && (
              <TouchableOpacity
                style={localStyles.deleteButtonDetails}
                onPress={() => setConfirmVisible(true)}
                disabled={isDeleting}
              >
                <Text style={localStyles.actionButtonText}>{isDeleting ? 'Excluindo...' : 'Excluir'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal de confirmação simples usando native Modal e estilos locais */}
          <Modal transparent visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
            <View style={localStyles.confirmOverlay}>
              <View style={localStyles.confirmModalBox}> 
                <Text style={[localStyles.detailsTitle, { marginBottom: 10 }]}>Confirmar exclusão</Text>
                <Text style={{ marginBottom: 20 }}>Deseja realmente excluir este ponto?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <TouchableOpacity style={[localStyles.closeButtonDetails, { backgroundColor: '#777' }]} onPress={() => setConfirmVisible(false)} disabled={isDeleting}>
                    <Text style={localStyles.actionButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={localStyles.deleteButtonDetails}
                    onPress={async () => {
                      setIsDeleting(true);
                      try {
                        await deletePin(pin.id, currentUserId);
                        setConfirmVisible(false);
                        setAlertTitle('Sucesso');
                        setAlertMessage('Ponto excluído com sucesso.');
                        setAlertType('success');
                        setAlertVisible(true);
                        if (onDelete) onDelete();
                        onClose();
                      } catch (err) {
                        console.error('Erro ao excluir pin:', err);
                        setAlertTitle('Erro');
                        setAlertMessage('Não foi possível excluir o ponto.');
                        setAlertType('error');
                        setAlertVisible(true);
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Text style={{ color: 'white', fontWeight: '600' }}>{isDeleting ? 'Excluindo...' : 'Excluir'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* AlertBox personalizado para mostrar mensagens */}
          <AlertBox
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

const detailStyles = StyleSheet.create({
  previewWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#fff',
  },
  viewerClose: {
    position: 'absolute',
    top: 28,
    right: 16,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerLoading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  }
});
