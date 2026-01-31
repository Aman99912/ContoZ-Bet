import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const { colors, theme } = useTheme();
    const navigation = useNavigation();

    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;       // Opacity (Native)
    const scaleAnim = useRef(new Animated.Value(0.8)).current;    // Logo Scale (Native)
    const moveAnim = useRef(new Animated.Value(0)).current;       // Y Translation (Native)
    const widthAnim = useRef(new Animated.Value(0)).current;      // Loader Width (Non-Native)
    const contentOpacity = useRef(new Animated.Value(1)).current; // Exit Opacity (Native)

    useEffect(() => {
        // Sequence: 
        // 1. Fade In + Scale Up (Logo)
        // 2. Expand Loading Bar
        // 3. Move Up & Fade Out

        Animated.parallel([
            // 1. Logo Entrance
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
            // 2. Loader Fill (Non-Native for Width property)
            Animated.timing(widthAnim, {
                toValue: 1,
                duration: 2500, // Takes 2.5s to fill
                delay: 200,
                useNativeDriver: false, // Width requires false
                easing: Easing.bezier(0.65, 0, 0.35, 1),
            })
        ]).start();

        // Exit Logic
        const timer = setTimeout(() => {
            // Animate out - Move UP significantly and Fade Out
            Animated.parallel([
                Animated.timing(moveAnim, {
                    toValue: -150, // "thoda or upr jaye"
                    duration: 600,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.cubic),
                }),
                Animated.timing(contentOpacity, {
                    toValue: 0,
                    duration: 400,
                    delay: 200,
                    useNativeDriver: true,
                })
            ]).start(() => {
                // Navigation after animation
                navigation.replace('MainApp');
            });
        }, 2800); // Trigger exit slightly before loader finishes for smoothness

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            {/* Background Elements */}
            <View style={[styles.blob, styles.blobTop, { backgroundColor: colors.primary, opacity: theme === 'dark' ? 0.15 : 0.08 }]} />
            <View style={[styles.blob, styles.blobBottom, { backgroundColor: '#8B5CF6', opacity: theme === 'dark' ? 0.1 : 0.05 }]} />

            {/* Main Content */}
            <Animated.View style={[
                styles.content,
                {
                    opacity: Animated.multiply(fadeAnim, contentOpacity), // Combine fade-in and exit-fade
                    transform: [
                        { scale: scaleAnim },
                        { translateY: moveAnim }
                    ]
                }
            ]}>
                {/* Logo with Glow */}
                <View style={[styles.logoContainer, {
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }]}>
                    <Image
                        source={require('@/images/appicon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Text */}
                <View style={styles.textContainer}>
                    <CText style={[styles.title, { color: colors.textPrimary }]}>Conto-Z</CText>
                    <CText style={[styles.subtitle, { color: colors.primary }]}>PLAY • WIN • EARN</CText>
                </View>
            </Animated.View>

            {/* Footer Loader */}
            <Animated.View style={[
                styles.footer,
                {
                    opacity: contentOpacity, // Hide footer on exit
                    transform: [{ translateY: moveAnim }] // Move footer up with content? Optional. Let's keep it grounded or fade it out.
                    // Request was "upr jaye" (go up). Usually headers go up. Let's let the footer fade out in place or slide down.
                    // User said "thoda or upr jaye", implying the main logo.
                }
            ]}>
                <View style={[styles.loaderTrack, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <Animated.View style={[
                        styles.loaderFill,
                        {
                            backgroundColor: colors.primary,
                            width: widthAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })
                        }
                    ]} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    blob: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width / 2,
    },
    blobTop: {
        top: -width * 0.3,
        left: -width * 0.2,
    },
    blobBottom: {
        bottom: -width * 0.3,
        right: -width * 0.2,
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
        marginBottom: verticalScale(40),
    },
    logoContainer: {
        width: moderateScale(130),
        height: moderateScale(130),
        borderRadius: moderateScale(35),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: verticalScale(28),
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 15 },
        // shadowOpacity: 0.2,
        // shadowRadius: 25,
        // elevation: 12,
    },
    logo: {
        width: '75%',
        height: '75%',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: moderateScale(36),
        fontWeight: '800', // Thicker font
        letterSpacing: 1.5,
        marginBottom: verticalScale(10),
    },
    subtitle: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        letterSpacing: 5,
        opacity: 0.7,
    },
    footer: {
        position: 'absolute',
        bottom: verticalScale(60),
        width: '100%',
        alignItems: 'center',
    },
    loaderTrack: {
        width: width * 0.4, // Wider loader
        height: 5,
        borderRadius: 3,
        overflow: 'hidden',
    },
    loaderFill: {
        height: '100%',
        borderRadius: 3,
    }
});

export default SplashScreen;
