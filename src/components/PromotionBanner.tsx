import { Spacing } from '@/constants/Spacing';
import { promotionData } from '@/data/promotion-data';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PromotionBannerProps {
  size?: 'large' | 'small';
}

const useStyles = (isSmall: boolean, bannerWidth: number) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: isSmall ? 400 : 200,
          borderRadius: Spacing.md,
          overflow: 'hidden',
          marginVertical: Spacing.md,
          width: isSmall ? '100%' : 'auto',
        },
        slider: {
          flexDirection: 'row',
          height: '95%',
        },
        slide: {
          width: bannerWidth,
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isSmall ? Spacing.sm : Spacing.lg,
          backgroundColor: 'transparent',
        },
        image: {
          width: isSmall ? 290 : 100,
          height: isSmall ? 290 : 100,
          marginRight: 0,
          marginBottom: Spacing.md,
        },
        textContainer: {
          width: '80%',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.xs,
          borderRadius: Spacing.sm,
        },
        title: {
          fontSize: isSmall ? 14 : 20,
          fontWeight: 'bold',
          marginBottom: Spacing.sm,
          textAlign: 'center',
          color: '#FFFFFF',
        },
        description: {
          fontSize: isSmall ? 12 : 16,
          textAlign: 'center',
          color: '#FFFFFF',
        },
        pagination: {
          flexDirection: 'row',
          position: 'absolute',
          bottom: 5,
          alignSelf: 'center',
        },
        dot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#333',
          marginHorizontal: 3,
        },
        modalContainer: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalImage: {
          width: screenWidth * 0.9,
          height: screenHeight * 0.9,
        },
      }),
    [isSmall, bannerWidth]
  );
};

const PromotionBanner = ({ size = 'large' }: PromotionBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageSourcePropType | null>(
    null
  );

  const isSmall = size === 'small';
  const bannerWidth = isSmall ? 300 : screenWidth;

  const styles = useStyles(isSmall, bannerWidth);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % promotionData.length;
        Animated.spring(scrollX, {
          toValue: -bannerWidth * nextIndex,
          useNativeDriver: false,
        }).start();
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerWidth]);

  const handleImagePress = (image: ImageSourcePropType) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.slider, { transform: [{ translateX: scrollX }] }]}
      >
        {promotionData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleImagePress(item.image)}
          >
            <View style={styles.slide}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
      <View style={styles.pagination}>
        {promotionData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { opacity: currentIndex === index ? 1 : 0.5 }]}
          />
        ))}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            {selectedImage && (
              <Image
                source={selectedImage}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default PromotionBanner;
