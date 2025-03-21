import 'react-native-get-random-values';
import { v4 as uuidV4} from "uuid"

export function GenId() {
  return uuidV4()
}