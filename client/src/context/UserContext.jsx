import React, { useState, createContext, useContext } from "react";

const UserContext = createContext()



const UserProvider = (props) => {
    const [accountData, setAccountData] = useState('0')



    return <UserContext.Provider value={[accountData, setAccountData]}>
        {props.children}
    </UserContext.Provider>
}

export { UserContext, UserProvider }