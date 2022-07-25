let permissions = null;
let can = (permission) => permissions.includes(permission)
let cannot = (permission) => !permissions.includes(permission)

export default function( context, inject){
    return context.store.subscribe((mutation, state) => {
        switch (mutation.type) {
            case 'auth/SET':
                if(state.auth.user && state.auth.user.permissions){
                    permissions = state.auth.user.permissions;
                } else{
                    permissions = []
                }
                inject('can', can);
                context.$can = can
                inject('cannot', cannot);
                context.$cannot = cannot
                break;
        }
    });
}
