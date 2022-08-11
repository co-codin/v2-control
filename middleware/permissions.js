export default function (ctx) {
    const routePermissions = ctx.route?.meta?.[0]?.permissions ?? null;

    if(!Array.isArray(routePermissions) || !Boolean(routePermissions.length)) {
        return;
    }

    const userPermissions = ctx.store.state.auth.user.permissions ?? [];
    const intersection = routePermissions.filter(permission => userPermissions.includes(permission));

    if(intersection.length === routePermissions.length) {
        return;
    }

    console.log('error');

    ctx.error({statusCode: 403, message: "Нет доступа"});
}
