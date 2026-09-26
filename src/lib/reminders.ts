import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { JANA_NOTIFICATIONS } from './jana';

/**
 * Reminders / lokale Push-Notifications von Coach Jana.
 *
 * 4 Erinnerungs-Typen (an-/abwaehlbar in den Einstellungen):
 * - Morgen-Motivation um 7:00
 * - Wasser alle 3 Stunden zwischen 9-21 Uhr
 * - Bewegungs-Impuls um 12:30
 * - Abend-Reflexion um 20:00
 */

export type ReminderKey = 'morning' | 'water' | 'movement' | 'evening';

export type ReminderSettings = {
  morning: boolean;
  water: boolean;
  movement: boolean;
  evening: boolean;
};

const STORAGE_KEY = 'bodyshift.reminders.v1';

export const DEFAULT_SETTINGS: ReminderSettings = {
  morning: true,
  water: true,
  movement: true,
  evening: true,
};

// Deterministisch je Tag rotieren, damit dieselbe Zeit nicht dieselbe Nachricht bringt
function pickText(list: readonly string[]): string {
  const seed = new Date().getDate() + new Date().getMonth();
  return list[seed % list.length];
}

/** Berechtigung anfragen — muss beim ersten Aktivieren aufgerufen werden */
export async function requestPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

/** Aktueller Berechtigungsstatus (ohne zu fragen) */
export async function hasPermission(): Promise<boolean> {
  const s = await Notifications.getPermissionsAsync();
  return s.granted;
}

/** Einstellungen laden */
export async function loadSettings(): Promise<ReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as ReminderSettings) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Einstellungen speichern und Notifications neu planen */
export async function saveSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  await rescheduleAll(settings);
}

/** Setup einmalig beim App-Start */
export async function initReminders(): Promise<void> {
  // Notification-Handler: was passiert wenn Notification kommt waehrend App offen ist
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Android-Kanal — notwendig fuer Anzeige
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'BodyShift',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  // Nur planen wenn Berechtigung vorhanden
  const granted = await hasPermission();
  if (!granted) return;

  const settings = await loadSettings();
  await rescheduleAll(settings);
}

/** Alle Notifications neu planen (canceln + neu schedulen) */
export async function rescheduleAll(settings: ReminderSettings): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (settings.morning) await scheduleDaily(7, 0, 'Guten Morgen', pickText(JANA_NOTIFICATIONS.morning));
  if (settings.evening) await scheduleDaily(20, 0, 'Feierabend', pickText(JANA_NOTIFICATIONS.eveningReflect));
  if (settings.movement) await scheduleDaily(12, 30, 'Kurzer Reminder', pickText(JANA_NOTIFICATIONS.movementNoon));

  if (settings.water) {
    // Alle 3h zwischen 9 und 21 Uhr: 9, 12, 15, 18, 21
    for (const h of [9, 12, 15, 18, 21]) {
      await scheduleDaily(h, 0, 'Wasser-Check', pickText(JANA_NOTIFICATIONS.waterReminder));
    }
  }
}

async function scheduleDaily(
  hour: number,
  minute: number,
  title: string,
  body: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}
