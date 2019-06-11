const user = (state =[], {name, email, type})=>{  //сохрнаять авторизованного пользовтаеля  (...state-сохраняет текуший state)
    switch(type) {
        case 'AUTHORIZE_USER':
        return {
            name,
            email,
        };
        default:
        return state;
    }
}

export default user;