import { Platform } from 'react-native';

export const scheduleApplicationNotification = async (title, company) => {
  try {
    if (__DEV__) {
      console.log("Skipping notification in Expo Go");
      return;
    }

    const Notifications = require('expo-notifications');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Application Submitted ✅",
        body: `You applied for ${title} at ${company}`,
      },
      trigger: null,
    });

  } catch (e) {
    console.log("Notification error:", e);
  }
};