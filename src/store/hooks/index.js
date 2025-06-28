import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useAuth = () => {
    return useAppSelector((state) => state.auth);
};

export const useUser = () => {
    return useAppSelector((state) => state.user);
};