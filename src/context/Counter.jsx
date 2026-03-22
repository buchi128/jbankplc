import { createSlice } from '@reduxjs/toolkit'



const Counter = createSlice({
    name : "counter",
    initialState :{
        count : 0,
        allUsers : [],
        username : ""
    },
    reducers:{
        increment:(state)=>{
        //   state.count = state.count + 1
        //   or
        state.count += 1
        // or 
        // state.count++
        },
        decrement:(state)=>{
         state.count -= 1
        }, 
        increasebynumber:(state, action)=>{
           state.count += action.payload
        }
    }
})
export const {increment,decrement,increasebynumber} = Counter.actions
export default Counter.reducer