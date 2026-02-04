export interface Note {
  id: string;
  title: string;
  date: Date;
  duration: number; // seconds
  audioUri: string | null;
  iconBackgroundColor: string;
  iconColor: string;
  iconBorderColor: string;
  iconName?: string;
}
