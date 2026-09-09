import { Gamepad2, Code2, Globe, Joystick, Brain, Cpu, BookOpen } from 'lucide-react';

/** Kurs verisindeki ikon adını gerçek bileşene çevirir. */
const ICONS: Record<string, React.ElementType> = {
  Gamepad2,
  Code2,
  Globe,
  Joystick,
  Brain,
  Cpu,
};

export default function CourseIcon({
  name,
  className = 'w-6 h-6',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} />;
}
