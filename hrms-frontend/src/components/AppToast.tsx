import { Toaster } from 'react-hot-toast';

const AppToast: React.FC = () => {

    return (
        <Toaster
            toastOptions={{
                success: {
                    duration: 3000,
                    style: {
                        background: '#ccf9a4',
                    },
                },
                error: {
                    style: {
                        background: '#f9a4a6',
                    },
                },
            }}
            containerStyle={{
                top: 20,
                right: 20,
            }}
            position="top-center"
        />
    )
}
export default AppToast;