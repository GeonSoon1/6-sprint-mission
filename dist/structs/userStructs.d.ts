import * as s from "superstruct";
export declare const CreateUser: s.Struct<{
    password: string;
    email: string;
    nickname: string;
    image?: string | undefined;
}, {
    email: s.Struct<string, null>;
    nickname: s.Struct<string, null>;
    image: s.Struct<string | undefined, null>;
    password: s.Struct<string, null>;
}>;
export declare const PatchUser: s.Struct<{
    email?: string | undefined;
    nickname?: string | undefined;
    image?: string | undefined;
}, import("superstruct/dist/utils").PartialObjectSchema<{
    email: s.Struct<string, null>;
    nickname: s.Struct<string, null>;
    image: s.Struct<string | undefined, null>;
}>>;
export declare const ChangePassword: s.Struct<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}, {
    currentPassword: s.Struct<string, null>;
    newPassword: s.Struct<string, null>;
    confirmNewPassword: s.Struct<string, null>;
}>;
//# sourceMappingURL=userStructs.d.ts.map