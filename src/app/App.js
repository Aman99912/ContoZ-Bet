import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/components/layout/Navbar';
import Header from '@/components/common/Header';
import CText from '@/components/common/CText';
import CCard from '@/components/common/CCard';
import { moderateScale, verticalScale } from '@/core/utils/responsive';

import '@/core/i18n';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Header title={t('home')} />
        <Navbar />
        <View style={styles.container}>
          <View style={styles.header}>
            <CText numberOfLines={1} adjustsFontSizeToFit style={styles.title}>{t('greeting')} Alexander</CText>
            <CText numberOfLines={1} adjustsFontSizeToFit style={styles.subtitle}>{t('welcomeSub')}</CText>
          </View>

          <CCallout t={t} />

          <View style={styles.langToggleContainer}>
            <CText style={styles.langLabel}>Language: {i18n.language.toUpperCase()}</CText>
            <View style={styles.langButtons}>
              <View style={styles.toggleButton}>
                <CText
                  style={[styles.toggleText, i18n.language === 'en' && styles.activeToggle]}
                  onPress={() => i18n.changeLanguage('en')}
                >
                  EN
                </CText>
                <CText
                  style={[styles.toggleText, i18n.language === 'hi' && styles.activeToggle]}
                  onPress={() => i18n.changeLanguage('hi')}
                >
                  HI
                </CText>
              </View>
            </View>
          </View>

          <StatusBar style="light" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const CCallout = ({ t }) => (
  <CCard>
    <CText numberOfLines={1} adjustsFontSizeToFit style={styles.cardTitle}>{t('startScan')}</CText>
    <CText style={styles.cardText}>
      {t('lockedSection')}
    </CText>
  </CCard>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    padding: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
    minHeight: verticalScale(120), // Stabilize top section
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(48),
    fontWeight: '900',
    color: '#38bdf8',
    letterSpacing: -1,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: '#94a3b8',
    marginTop: verticalScale(8),
    textAlign: 'center',
    width: '100%',
  },
  cardTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: verticalScale(12),
  },
  cardText: {
    fontSize: moderateScale(16),
    color: '#cbd5e1',
    lineHeight: moderateScale(24),
  },
  langToggleContainer: {
    marginTop: verticalScale(40),
    alignItems: 'center',
    minHeight: verticalScale(80), // Prevent footer jumping
  },
  langLabel: {
    color: '#94a3b8',
    fontSize: moderateScale(12),
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
  },
  langButtons: {
    flexDirection: 'row',
  },
  toggleButton: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: moderateScale(4),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleText: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(8),
    fontSize: moderateScale(12),
    fontWeight: '900',
    color: '#94a3b8',
    borderRadius: moderateScale(8),
  },
  activeToggle: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
  },
});
