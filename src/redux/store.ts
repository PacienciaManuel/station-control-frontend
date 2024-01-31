import { configureStore } from '@reduxjs/toolkit'
import funcionarioSlicer from './slicer/funcionarioSlicer';
import totalsSlicer from './slicer/totalsSlicer';

export const makeStore = () => {
    return configureStore({
        reducer: {
            totals: totalsSlicer,
            funcionario: funcionarioSlicer,
        }
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']