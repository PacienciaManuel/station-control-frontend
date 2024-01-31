import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';

interface ErrorResponse {
    timestamp: string,
    status: string,
    error: string,
    message: string,
    path: string,
}

export default function useErrorHandler(title: string) {
    return (error: AxiosError<ErrorResponse>) => {
        notifications.show({title: title, message: error?.response?.data.message || error?.message || "Não foi possivel efetuar a operação!", color: "red"});
    }
}
