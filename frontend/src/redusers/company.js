const company = (state =[], {isRegistered, currentTab, type})=>{  //сохрнаять авторизованного пользовтаеля  (...state-сохраняет текуший state)
    switch(type) {
        case 'GIVE_CONTROL_COMPANY':
        return {
            isRegistered,
            currentTab,
        };
        default:
        return state;
    }
}

export default company;