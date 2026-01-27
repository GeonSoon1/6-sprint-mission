import { UserType } from "./../libs/interfaces";
declare function findById(id: number): Promise<{
    password: string;
    refreshToken: string | null;
    id: number;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
declare function findByEmail(email: string): Promise<{
    password: string;
    refreshToken: string | null;
    id: number;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
declare function save(user: UserType): Promise<{
    password: string;
    refreshToken: string | null;
    id: number;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare function update(id: number, data: Partial<UserType>): Promise<{
    password: string;
    refreshToken: string | null;
    id: number;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const _default: {
    findById: typeof findById;
    findByEmail: typeof findByEmail;
    save: typeof save;
    update: typeof update;
};
export default _default;
//# sourceMappingURL=userRepository.d.ts.map