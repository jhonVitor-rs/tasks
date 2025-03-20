import { cn } from "@/utils/cn";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Text, View } from "react-native";

interface HeaderNavProps {
  children: ReactNode;
  className?: string;
}

export default function Header({ children, className }: HeaderNavProps) {
  return (
    <View
      className={cn(
        "flex flex-row w-full h-16 items-center justify-start px-4 bg-zinc-800 shadow-black/10",
        className
      )}
    >
      {children}
    </View>
  );
}

interface TitleProps {
  title: string;
  className?: string;
}

export function Title({ title, className }: TitleProps) {
  return (
    <Text className={cn("text-2xl font-bold text-zinc-200", className)}>
      {title}
    </Text>
  );
}
