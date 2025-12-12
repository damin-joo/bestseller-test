import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import MyAds from './BannerAd';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { APP_VERSION } from './config/version';

export const LANGUAGE_OPTIONS = [
  { label: '한국어', value: 0 },
  { label: 'English', value: 1 },
  { label: '日本語', value: 2 },
  { label: '中国人', value: 3 },
  { label: '台灣', value: 4 },
  { label: 'Français', value: 5 },
  { label: 'Español', value: 6 },
];

export default function SettingsPage({ navigation }) {
  const { language, setLanguage, userLanguage, setUserLanguage } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { theme, updateTheme, isDark, colors } = useTheme();

  // 화면이 포커스될 때마다 테마 다시 불러오기
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 테마는 ThemeContext에서 자동으로 불러옴
    });
    return unsubscribe;
  }, [navigation]);

  const handleLinkPress = async (url) => {
    try {
      console.log('🔗 Opening URL:', url);
      const supported = await Linking.canOpenURL(url);
      console.log('🔗 Can open URL:', supported);
      
      if (supported) {
        await Linking.openURL(url);
        console.log('🔗 URL opened successfully');
      } else {
        // canOpenURL이 false를 반환해도 직접 시도
        console.log('🔗 canOpenURL returned false, trying anyway...');
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('❌ Error opening URL:', error);
      // 사용자에게 알림을 표시할 수도 있음
      alert(`링크를 열 수 없습니다: ${error.message}`);
    }
  };

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 50,
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.primaryBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedItem: {
      backgroundColor: colors.secondaryBackground,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    selectedLabel: {
      fontWeight: '600',
    },
    languageValue: {
      fontSize: 16,
      color: colors.text,
    },
    themeContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1e293b' : '#F5F5F5',
      borderRadius: 8,
      padding: 4,
      gap: 4,
    },
    themeOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E0E0E0',
    },
    themeOptionActive: {
      backgroundColor: isDark ? '#1a1f2e' : '#9d4edd',
      borderColor: isDark ? '#1a1f2e' : '#9d4edd',
    },
    themeOptionText: {
      fontSize: 14,
      color: isDark ? (theme === 'Dark' ? '#60a5fa' : '#94a3b8') : (theme === 'Dark' ? '#fff' : '#000'),
      fontWeight: '500',
    },
    themeOptionTextActive: {
      color: isDark ? '#60a5fa' : '#fff',
      fontWeight: '600',
    },
    linkText: {
      fontSize: 16,
      color: colors.link,
      fontWeight: '600',
    },
    languageList: {
      backgroundColor: colors.secondaryBackground,
    },
    languageOptionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedLanguageOption: {
      backgroundColor: isDark ? '#1e293b' : '#E8F0FE',
    },
    languageOptionText: {
      fontSize: 15,
      color: colors.secondaryText,
    },
    selectedLanguageText: {
      color: colors.link,
      fontWeight: '600',
    },
    versionText: {
      fontSize: 16,
      color: colors.secondaryText,
      fontWeight: '500',
    },
  }), [colors, isDark]);

  return (
    <View style={dynamicStyles.container}>
      {/* 헤더 */}
      <View style={dynamicStyles.header}>
        <Icon name="cog" size={24} color={colors.text} style={styles.headerIcon} />
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: colors.primaryBackground }]} contentContainerStyle={styles.scrollContent}>
        {/* Language */}
        <View>
          <TouchableOpacity
            style={dynamicStyles.settingItem}
            activeOpacity={0.7}
            onPress={() => setIsLanguageOpen(!isLanguageOpen)}
          >
            <Text style={dynamicStyles.settingLabel}>Language</Text>
            <View style={styles.languageContainer}>
              <Text style={dynamicStyles.languageValue}>
                {LANGUAGE_OPTIONS.find(opt => opt.value === userLanguage)?.label || '한국어'}
              </Text>
              <Icon name={isLanguageOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.secondaryText} />
            </View>
          </TouchableOpacity>

          {isLanguageOpen && (
            <View style={dynamicStyles.languageList}>
              {LANGUAGE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    dynamicStyles.languageOptionItem,
                    language === option.value && dynamicStyles.selectedLanguageOption
                  ]}
                  onPress={async () => {
                    setUserLanguage(option.value);
                    setLanguage(option.value + 1);
                    setIsLanguageOpen(false);
                    // MainScreen에서 사용할 언어 이름 저장
                    const languageNames = ['Korean', 'English', 'Japanese', 'Chinese', 'Traditional Chinese', 'French', 'Spanish'];
                    const languageName = languageNames[option.value] || 'English';
                    try {
                      await AsyncStorage.setItem('appLanguage', languageName);
                    } catch (error) {
                      console.error('언어 설정 저장 실패:', error);
                    }
                  }}
                >
                  <Text style={[
                    dynamicStyles.languageOptionText,
                    userLanguage === option.value && dynamicStyles.selectedLanguageText
                  ]}>
                    {option.label}
                  </Text>
                  {userLanguage === option.value && (
                    <Icon name="check" size={20} color={colors.link} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Theme */}
        <View style={dynamicStyles.settingItem}>
          <Text style={dynamicStyles.settingLabel}>Theme</Text>
          <View style={dynamicStyles.themeContainer}>
            <TouchableOpacity
              style={[
                dynamicStyles.themeOption,
                theme === 'Dark' && dynamicStyles.themeOptionActive,
              ]}
              onPress={() => updateTheme('Dark')}
            >
              <Text
                style={[
                  dynamicStyles.themeOptionText,
                  theme === 'Dark' && dynamicStyles.themeOptionTextActive,
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dynamicStyles.themeOption,
                theme === 'Light' && dynamicStyles.themeOptionActive,
              ]}
              onPress={() => updateTheme('Light')}
            >
              <Text
                style={[
                  dynamicStyles.themeOptionText,
                  theme === 'Light' && dynamicStyles.themeOptionTextActive,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instagram */}
        <View style={dynamicStyles.settingItem}>
          <Text style={dynamicStyles.settingLabel}>Instagram</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleLinkPress('https://www.instagram.com/sunnyinnolab/')}
          >
            <Text style={dynamicStyles.linkText}>Link</Text>
          </TouchableOpacity>
        </View>

        {/* X (Twitter) */}
        <View style={dynamicStyles.settingItem}>
          <Text style={dynamicStyles.settingLabel}>X (Twitter)</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleLinkPress('https://x.com/Sunnyinnolab')}
          >
            <Text style={dynamicStyles.linkText}>Link</Text>
          </TouchableOpacity>
        </View>

        {/* Sunny's Games and Apps */}
        <TouchableOpacity
          style={dynamicStyles.settingItem}
          activeOpacity={0.7}
          onPress={() => {
            // TODO: 나중에 내용 추가
          }}
        >
          <Text style={dynamicStyles.settingLabel}>Sunny's Games and Apps</Text>
          <Icon name="chevron-right" size={24} color={colors.secondaryText} />
        </TouchableOpacity>

        {/* Credits */}
        <TouchableOpacity
          style={dynamicStyles.settingItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Credits')}
        >
          <Text style={dynamicStyles.settingLabel}>Credits</Text>
          <Icon name="chevron-right" size={24} color={colors.secondaryText} />
        </TouchableOpacity>

        {/* Open Source Info */}
        <TouchableOpacity
          style={dynamicStyles.settingItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('OpenSourceInfo')}
        >
          <Text style={dynamicStyles.settingLabel}>Open Source Info</Text>
          <Icon name="chevron-right" size={24} color={colors.secondaryText} />
        </TouchableOpacity>

        {/* App Version */}
        <View style={dynamicStyles.settingItem}>
          <Text style={dynamicStyles.settingLabel}>App Version</Text>
          <Text style={dynamicStyles.versionText}>v {APP_VERSION}</Text>
        </View>

        <View style={styles.adContainer}>
          <MyAds type="adaptive" size={BannerAdSize.BANNER} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: 12,
  },
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
