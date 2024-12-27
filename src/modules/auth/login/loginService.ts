import { Login } from "./loginSchema";
import { db } from "../../../db/db";
import { UUID } from "crypto";
import { Role } from "../../../db/schemas";
import { LoginErr } from "../../../errors/LoginErr";
import { Bcrypt } from "../../../services/bcrypt/bcrypt";
import { Jwt } from "../../../services/jwt/jwt";

export const loginService = async (login: Login) => {
  const account = await db.query.accounts.findFirst({
    where: (account, { eq }) => eq(account.email, login.email),
  });
  if (!account) throw new LoginErr();

  const isLogged = await Bcrypt.compare(login.password, account.password);
  if (!isLogged) throw new LoginErr();

  const token = Jwt.sign({
    id: account.id,
    role: account.role,
    img: account.img,
    name: account.name,
    email: account.email,
  });

  return token;
};

export type TokenPayload = {
  id: UUID;
  role: Role;
  name: string;
  img: string;
  email: string;
};
