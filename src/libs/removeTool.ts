// undefined인 키를 싹 지워주는 함수
export const removeUndefined = (obj: any) => {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};
