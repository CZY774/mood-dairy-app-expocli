import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { 
  Appbar, 
  Text, 
  useTheme, 
  Card, 
  List, 
  Switch, 
  Button,
  Divider 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ExportButton } from '../../components/ExportButton';
import { databaseService } from '../../lib/database';

export default function SettingsScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleThemeToggle = () => {
    // Note: Dalam implementasi sebenarnya, Anda perlu menggunakan state management
    // atau AsyncStorage untuk menyimpan preferensi theme
    setIsDarkMode(!isDarkMode);
    Alert.alert(
      'Theme Changed',
      'Restart aplikasi untuk melihat perubahan tema.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAllData = async () => {
    Alert.alert(
      'Hapus Semua Data',
      'Apakah Anda yakin ingin menghapus semua catatan mood? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: async () => {
            try {
              const allEntries = await databaseService.getAllMoodEntries();
              
              for (const entry of allEntries) {
                await databaseService.deleteMoodEntry(entry.date);
              }
              
              Alert.alert(
                'Berhasil',
                'Semua data telah dihapus.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Error deleting all data:', error);
              Alert.alert('Error', 'Gagal menghapus data. Silakan coba lagi.');
            }
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Tentang Mood Diary',
      'Mood Diary v1.0.0\n\nAplikasi untuk mencatat dan melacak mood harian Anda.\n\nDibuat dengan React Native, SQLite, dan React Native Paper.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="⚙️ Pengaturan" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* App Settings */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                🎨 Tampilan
              </Text>
              
              <List.Item
                title="Dark Mode"
                description="Gunakan tema gelap"
                left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleThemeToggle}
                  />
                )}
              />
            </Card.Content>
          </Card>

          {/* Data Management */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                📁 Kelola Data
              </Text>
              
              <View style={styles.exportContainer}>
                <Text variant="bodyMedium" style={[styles.exportDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Export semua catatan mood Anda ke file PDF
                </Text>
                <ExportButton variant="contained" style={styles.exportButton} />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.dangerZone}>
                <Text variant="titleSmall" style={[styles.dangerTitle, { color: theme.colors.error }]}>
                  ⚠️ Zona Berbahaya
                </Text>
                <Text variant="bodyMedium" style={[styles.dangerDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Hapus semua catatan mood yang telah disimpan. Tindakan ini tidak dapat dibatalkan.
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleDeleteAllData}
                  style={[styles.deleteButton, { borderColor: theme.colors.error }]}
                  textColor={theme.colors.error}
                  icon="delete-forever"
                >
                  Hapus Semua Data
                </Button>
              </View>
            </Card.Content>
          </Card>

          {/* App Info */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                ℹ️ Informasi Aplikasi
              </Text>
              
              <List.Item
                title="Tentang"
                description="Informasi aplikasi dan versi"
                left={(props) => <List.Icon {...props} icon="information" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleAbout}
              />

              <List.Item
                title="Versi"
                description="1.0.0"
                left={(props) => <List.Icon {...props} icon="tag" />}
              />

              <List.Item
                title="Developer"
                description="React Native Developer"
                left={(props) => <List.Icon {...props} icon="account-circle" />}
              />
            </Card.Content>
          </Card>

          {/* Tips */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                💡 Tips Penggunaan
              </Text>
              
              <View style={styles.tipItem}>
                <Text variant="bodyMedium" style={[styles.tipText, { color: theme.colors.onSurface }]}>
                  📝 Catat mood setiap hari untuk mendapatkan insight yang lebih akurat
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text variant="bodyMedium" style={[styles.tipText, { color: theme.colors.onSurface }]}>
                  📊 Lihat statistik secara berkala untuk memahami pola mood Anda
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text variant="bodyMedium" style={[styles.tipText, { color: theme.colors.onSurface }]}>
                  🎯 Pilih aktivitas yang tepat untuk membantu analisis mood
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text variant="bodyMedium" style={[styles.tipText, { color: theme.colors.onSurface }]}>
                  💾 Export data secara berkala sebagai backup
                </Text>
              </View>
            </Card.Content>
          </Card>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  exportContainer: {
    marginBottom: 16,
  },
  exportDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  exportButton: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  dangerZone: {
    paddingTop: 8,
  },
  dangerTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  dangerDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  deleteButton: {
    alignSelf: 'flex-start',
  },
  tipItem: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  tipText: {
    lineHeight: 20,
  },
});