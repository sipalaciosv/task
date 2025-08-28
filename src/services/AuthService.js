import { storage } from "../../utils/storage.js";
import { User } from "../models/User.js";

export class AuthService {
  constructor() {
    this.state = storage.load();
  }

  #findUserByEmail(email) {
    return this.state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  register({ nombre, email }) {
    if (!nombre || nombre.trim().length < 3) throw new Error("Nombre inválido");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Email inválido");
    if (this.#findUserByEmail(email))
      throw new Error("Ese email ya está registrado");

    const user = new User({
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      email: email.trim(),
    });
    this.state.users.push(user);
    storage.save(this.state);
    return user;
  }

  login({ email, nombre }) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Email inválido");
    let user = this.#findUserByEmail(email);
    if (!user) {
      const n =
        nombre && nombre.trim().length >= 3
          ? nombre.trim()
          : email.split("@")[0];
      user = new User({
        id: crypto.randomUUID(),
        nombre: n,
        email: email.trim(),
      });
      this.state.users.push(user);
    }
    this.state.session = { userId: user.id, loggedAt: Date.now() };
    storage.save(this.state);
    return user;
  }

  logout() {
    this.state = storage.load();
    this.state.session = null;
    storage.save(this.state);
  }

  currentUser() {
    this.state = storage.load();
    return (
      this.state.users.find(
        (u) => this.state.session && u.id === this.state.session.userId
      ) || null
    );
  }

  allUsers() {
    this.state = storage.load();
    return this.state.users.slice();
  }
}
