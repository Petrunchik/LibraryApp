import { toast } from "../hooks/useToast";

export const copyField = (text) => {
        navigator.clipboard.writeText(text)
        toast.info(`Скопировано: ${text}`)
    }