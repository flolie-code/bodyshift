import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { calcDayTotals, type Meal, type DayTotals } from '@/lib/meals';
import { calcMacros } from '@/lib/nutrition';

export type HomeData = {
  loading: boolean;
  firstName: string;
  dailyGoal: number;
  todayTotals: DayTotals;
  macroGoals: { protein: number; carbs: number; fat: number };
  weekConsumed: number[]; // 7 werte: Mo..So (aktuelle Woche)
  weekMeta: { weekNumber: number; weekBudget: number };
  refresh: () => Promise<void>;
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMondayOfCurrentWeek(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // 0=Mo
  d.setDate(d.getDate() - dow);
  return d;
}

function isoWeekNumber(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / (7 * 24 * 3600 * 1000));
}

const DEFAULT_GOAL = 1800;

export function useHomeData(): HomeData {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(DEFAULT_GOAL);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [weekConsumed, setWeekConsumed] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      // Profil (name + tages-ziel)
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, target_kcal_daily')
        .eq('user_id', userData.user.id)
        .maybeSingle();
      if (profile) {
        setFirstName(profile.first_name ?? '');
        if (profile.target_kcal_daily) setDailyGoal(profile.target_kcal_daily);
      }

      // Meals der aktuellen Woche
      const monday = getMondayOfCurrentWeek();
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const { data: meals } = await supabase
        .from('meals')
        .select('*')
        .gte('logged_at', monday.toISOString())
        .lte('logged_at', sunday.toISOString());

      const week = [0, 0, 0, 0, 0, 0, 0];
      const todayIso = isoDate(new Date());
      const todaysMeals: Meal[] = [];

      (meals ?? []).forEach((m: Meal) => {
        const d = new Date(m.logged_at);
        const dayIdx = (d.getDay() + 6) % 7;
        week[dayIdx] += m.kcal || 0;
        if (isoDate(d) === todayIso) todaysMeals.push(m);
      });

      setTodayMeals(todaysMeals);
      setWeekConsumed(week);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    loading,
    firstName,
    dailyGoal,
    todayTotals: calcDayTotals(todayMeals),
    macroGoals: calcMacros(dailyGoal),
    weekConsumed,
    weekMeta: {
      weekNumber: isoWeekNumber(new Date()),
      weekBudget: dailyGoal * 7,
    },
    refresh: load,
  };
}
