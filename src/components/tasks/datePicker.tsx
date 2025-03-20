import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { DrawerBotton } from "../ui/drawerBotton";

interface DatePickerProps {
  open: boolean;
  setHide: () => void;
}

export function DatePicker({ open, setHide }: DatePickerProps) {
  return (
    <DrawerBotton open={open} setHide={setHide} className="min-h-[90%]">
      <View>
        <Calendar />
      </View>
    </DrawerBotton>
  );
}
